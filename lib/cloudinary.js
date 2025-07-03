// Configuración y funciones de Cloudinary para manejo de imágenes

export const CLOUDINARY_CONFIG = {
  cloudName:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: "aesthetic_images", // Crear este preset en Cloudinary
};

// Función para subir imagen al cliente (frontend)
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error uploading image");
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// Función para generar URLs de transformación
export const getTransformedImageUrl = (publicId, transformations = {}) => {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "face",
  } = transformations;

  let transformationString = `q_${quality},f_${format}`;

  if (width || height) {
    transformationString += `,c_${crop}`;
    if (width) transformationString += `,w_${width}`;
    if (height) transformationString += `,h_${height}`;
    if (crop === "fill" || crop === "crop")
      transformationString += `,g_${gravity}`;
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformationString}/${publicId}`;
};

// Función para optimizar imagen para preview
export const getOptimizedImageUrl = (publicId, size = "medium") => {
  const sizes = {
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    thumbnail: { width: 150, height: 150 },
  };

  return getTransformedImageUrl(publicId, {
    ...sizes[size],
    quality: "auto:best",
    crop: "fit",
  });
};

// Función para crear múltiples versiones de una imagen
export const createImageVariants = (publicId) => {
  return {
    thumbnail: getOptimizedImageUrl(publicId, "thumbnail"),
    small: getOptimizedImageUrl(publicId, "small"),
    medium: getOptimizedImageUrl(publicId, "medium"),
    large: getOptimizedImageUrl(publicId, "large"),
    original: `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${publicId}`,
  };
};

// Función para eliminar imagen (usar desde API routes)
export const deleteImageFromCloudinary = async (publicId) => {
  const cloudinary = require("cloudinary").v2;

  cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.cloudName,
    api_key: CLOUDINARY_CONFIG.apiKey,
    api_secret: CLOUDINARY_CONFIG.apiSecret,
  });

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

// Función para validar archivo antes de upload
export const validateImageFile = (file) => {
  const errors = [];

  // Validar tipo de archivo
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    errors.push("Tipo de archivo no válido. Solo se permiten JPG y PNG.");
  }

  // Validar tamaño (10MB máximo)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push("El archivo es demasiado grande. Máximo 10MB.");
  }

  // Validar dimensiones mínimas (opcional)
  return new Promise((resolve) => {
    if (errors.length > 0) {
      resolve({ valid: false, errors });
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Validar dimensiones mínimas
      if (img.width < 300 || img.height < 300) {
        errors.push("La imagen debe tener al menos 300x300 píxeles.");
      }

      resolve({
        valid: errors.length === 0,
        errors,
        dimensions: { width: img.width, height: img.height },
      });
    };

    img.onerror = () => {
      errors.push("No se pudo cargar la imagen.");
      resolve({ valid: false, errors });
    };

    img.src = URL.createObjectURL(file);
  });
};

// Hook para usar Cloudinary en componentes React
export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setUploading(true);
    setError(null);

    try {
      // Validar archivo
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.errors.join(" "));
      }

      // Subir a Cloudinary
      const result = await uploadImageToCloudinary(file);

      setUploading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setUploading(false);
      throw err;
    }
  };

  return { uploadImage, uploading, error };
};

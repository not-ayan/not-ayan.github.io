import { Cloudinary } from "@cloudinary/url-gen";
import type { NextApiRequest, NextApiResponse } from 'next';

// Configure Cloudinary
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  },
});

// Function to get all Cloudinary images from the "renders" folder and its subfolders
export async function getCloudinaryImages() {
  try {
    const response = await fetch('/api/cloudinary-images');
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return [];
  }
}

// API handler to fetch Cloudinary images
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, NEXT_PUBLIC_CLOUDINARY_API_SECRET } = process.env;
  const subfolder = req.query.subfolder as string | undefined;

  try {
    if (subfolder) {
      // Fetch all images from the specified subfolder
      const subfolderResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=${subfolder}/`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${NEXT_PUBLIC_CLOUDINARY_API_KEY}:${NEXT_PUBLIC_CLOUDINARY_API_SECRET}`).toString('base64')}`,
          },
        }
      );

      if (!subfolderResponse.ok) {
        const errorText = await subfolderResponse.text();
        throw new Error(`Cloudinary API request failed with status ${subfolderResponse.status}: ${errorText}`);
      }

      const subfolderData = await subfolderResponse.json();
      const allImagesInSubfolder = subfolderData.resources.map((resource: any) => ({
        public_id: resource.public_id,
        secure_url: cloudinary.image(resource.public_id).format('auto').quality('auto').toURL(),
        display_name: resource.public_id.split("/").pop(),
        width: resource.width,
        height: resource.height,
        folder: subfolder
      }));
      return res.status(200).json(allImagesInSubfolder);
    }

    // Fetch subfolders in the "renders" folder with a higher max_results
    const foldersResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/folders/renders?max_results=100`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${NEXT_PUBLIC_CLOUDINARY_API_KEY}:${NEXT_PUBLIC_CLOUDINARY_API_SECRET}`).toString('base64')}`,
        },
      }
    );

    if (!foldersResponse.ok) {
      const errorText = await foldersResponse.text();
      throw new Error(`Cloudinary API request failed with status ${foldersResponse.status}: ${errorText}`);
    }

    const foldersData = await foldersResponse.json();
    const subfolders = foldersData.folders;

    const images = [];

    // Fetch the first image from each subfolder
    for (const folder of subfolders) {
      const subfolderResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=${folder.path}/&max_results=1`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${NEXT_PUBLIC_CLOUDINARY_API_KEY}:${NEXT_PUBLIC_CLOUDINARY_API_SECRET}`).toString('base64')}`,
          },
        }
      );

      if (!subfolderResponse.ok) {
        const errorText = await subfolderResponse.text();
        throw new Error(`Cloudinary API request failed with status ${subfolderResponse.status}: ${errorText}`);
      }

      const subfolderData = await subfolderResponse.json();
      if (subfolderData.resources.length > 0) {
        const resource = subfolderData.resources[0];
        images.push({
          public_id: resource.public_id,
          secure_url: cloudinary.image(resource.public_id).format('auto').quality('auto').toURL(),
          display_name: resource.public_id.split("/").pop(),
          width: resource.width,
          height: resource.height,
          folder: folder.path
        });
      }
    }

    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    res.status(500).json({ error: "Failed to fetch images", details: error.message });
  }
}

export async function searchCloudinaryImageByFilename(filename: string) {
  try {
    const result = await cloudinary.search
      .expression(`resource_type:image AND filename:${filename}`)
      .execute();

    return result.resources.length > 0 ? result.resources[0] : null;
  } catch (error) {
    console.error("Error searching image by filename:", error);
    return null;
  }
}

// Function to get a Cloudinary image by its public ID
export async function getCloudinaryImageById(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });

    return {
      public_id: result.public_id,
      secure_url: cloudinary.image(result.public_id).format('auto').quality('auto').toURL(),
      display_name: result.display_name,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Error fetching Cloudinary image by ID:", error);
    return null;
  }
}


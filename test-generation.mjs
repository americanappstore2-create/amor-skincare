import { generateImage } from "./server/_core/imageGeneration.ts";

async function test() {
  try {
    console.log('Testing image generation...');
    const result = await generateImage({
      prompt: "luxury skincare serum bottle, elegant glass bottle, professional product photography",
    });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();

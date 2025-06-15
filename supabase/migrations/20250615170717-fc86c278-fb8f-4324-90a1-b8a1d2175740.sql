
-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

-- Create policy to allow public access to view files
CREATE POLICY "Allow public access" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'product-images');

-- Create policy to allow authenticated users to update files
CREATE POLICY "Allow authenticated updates" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images');

-- Create policy to allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');

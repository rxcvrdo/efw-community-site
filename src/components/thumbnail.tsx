/* eslint-disable @next/next/no-img-element */

interface ThumbnailProps {
    url: string | null | undefined;
  }
  
  export const Thumbnail = ({ url }: ThumbnailProps) => {
    if (!url)
    return null;
  
    return (
      <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-pointer">
        <img
          src={url}
          alt="message file"
          className="w-full h-auto rounded-md object-cover"
          onError={(e) => {
            console.error("Failed to load image:", url);
          
          }}
        />
      </div>
    );
  };
  
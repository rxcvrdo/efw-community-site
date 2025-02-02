import { useEffect, useRef, useState } from "react";
import Quill from "quill";

const Renderer = ({ value }: { value: string }) => {
    const rendererRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        if (!rendererRef.current) return;

        const container = rendererRef.current;
        const quill = new Quill(document.createElement("div"), {
            theme: "snow",
        });

        quill.enable(false);

        let contents;
        try {
            contents = JSON.parse(value);
        } catch (error) {
            console.error("Invalid JSON content:", error);
            return;
        }

        quill.setContents(contents);

        const isEmptyText = quill.getText().trim().length === 0;
        setIsEmpty(isEmptyText);

        container.innerHTML = quill.root.innerHTML;

        return () => {
            container.innerHTML = ""; // Proper cleanup
        };
    }, [value]);

    if (isEmpty) return null;

    return <div ref={rendererRef} className="ql-editor ql-renderer" />;
};

export default Renderer;

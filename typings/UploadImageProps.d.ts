/**
 * This file was generated from UploadImage.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { DynamicValue, EditableValue, NativeImage } from "mendix";

export interface UploadImageProps<Style> {
    name: string;
    style: Style[];
    Base64: EditableValue<string>;
    Type?: EditableValue<string>;
    qual?: EditableValue<string>;
    logoUpload: DynamicValue<NativeImage>;
    logoCamera: DynamicValue<NativeImage>;
    fileUpload: DynamicValue<NativeImage>;
    galleryupload: DynamicValue<NativeImage>;
    allowPdf: boolean;
    onlyimage: boolean;
    allowInvoice: boolean;
    logoInvoice?: DynamicValue<NativeImage>;
    containerWidth: number;
    containerHeight: number;
    fileSize: number;
}

export interface UploadImagePreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    Base64: string;
    Type: string;
    qual: string;
    onBase64Change: {} | null;
    logoUpload: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    logoCamera: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    fileUpload: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    galleryupload: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    allowPdf: boolean;
    onlyimage: boolean;
    allowInvoice: boolean;
    logoInvoice: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    containerWidth: number | null;
    containerHeight: number | null;
    fileSize: number | null;
}

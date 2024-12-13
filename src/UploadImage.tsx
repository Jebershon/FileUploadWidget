import { ReactElement, createElement } from "react";
import { TextStyle, ViewStyle } from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";

import { HelloWorld } from "./components/HelloWorld";
import { UploadImageProps } from "../typings/UploadImageProps";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export function UploadImage({
    style,
    Base64,
    galleryupload,
    fileUpload,
    logoCamera,
    logoUpload,
    logoInvoice,
    allowPdf,
    fileSize,
    allowInvoice,
    containerHeight,
    containerWidth,
    onlyimage,

    qual,
    Type
}: UploadImageProps<CustomStyle>): ReactElement {
    return (
        <HelloWorld
            Base64={Base64}
            logoUpload={logoUpload}
            logoCamera={logoCamera}
            allowPdf={allowPdf}
            fileSize={fileSize}
            style={style}
            Type={Type}
            allowInvoice={allowInvoice}
            logoInvoice={logoInvoice}
            containerHeight={containerHeight}
            containerWidth={containerWidth}
            fileUpload={fileUpload}
            galleryupload={galleryupload}
            qual={qual}
            onlyimage={onlyimage}
        />
    );
}

import React, { ReactElement, useState, createElement, useEffect } from "react";
import { View, Alert, TouchableOpacity, Image, Text, Platform, Modal, StyleSheet,Linking } from "react-native";
import RNFS from "react-native-fs";
import { EditableValue, DynamicValue, NativeImage, ActionValue } from "mendix";
import DocumentPicker from "react-native-document-picker";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { mergeNativeStyles } from "@mendix/pluggable-widgets-tools";
import ImagePicker from "react-native-image-crop-picker";
import { CustomStyle } from "../UploadImage";

import { SvgXml } from "react-native-svg";
import { Image as I } from "react-native-compressor";

export interface HelloWorldProps {
    Base64: EditableValue<string>;
    style: CustomStyle[];
    logoUpload: DynamicValue<NativeImage>;
    logoCamera: DynamicValue<NativeImage>;
    logoInvoice: DynamicValue<NativeImage>;
    fileUpload: DynamicValue<NativeImage>;
    galleryupload: DynamicValue<NativeImage>;
    allowPdf: boolean;
    onlyimage: boolean;
    allowInvoice: boolean;
    fileSize: number;
    fileName?: EditableValue<string>;
    Type?: EditableValue<string>;
    containerWidth: number;
    containerHeight: number;

    qual?: EditableValue<string>;
}

const defaultStyle: CustomStyle = {
    container: {},
    label: {
        color: "#F6BB42"
    }
};


export function HelloWorld({
    Base64,
    logoCamera,
    galleryupload,
    fileUpload,
    qual,
    logoUpload,
    logoInvoice,
    allowPdf,
    onlyimage,
    fileSize,
    containerHeight,
    containerWidth,
    style,
    Type,

    allowInvoice
}: HelloWorldProps): ReactElement {
    const styles = mergeNativeStyles(defaultStyle, style);
    const [modalVisible, setModalVisible] = useState(false);

    const acceptedTypes = [DocumentPicker.types.images];
    const MAX_FILE_SIZE_BYTES = fileSize * 1024 * 1024; // 5 MB (adjust as needed)

    if (allowPdf) {
        acceptedTypes.push(DocumentPicker.types.pdf);
    }
    const settrue = () => {
        setModalVisible(true);
    };
    const openSettings = () => {
        if (Platform.OS === 'android') {
            Linking.openSettings();  // For Android, opens app's settings directly
        } else {
            Linking.openURL('app-settings:');  // For iOS, it opens the app's settings screen
        }
    }
    const checkFileUploadPermission = async () => {
        try {
            let permission;

            if (Platform.OS === "ios") {
                permission = PERMISSIONS.IOS.PHOTO_LIBRARY; // For iOS photo library access
            } else {
                // Use different permissions based on Android version
                if (Platform.Version >= 29) {
                    permission = PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION; // For Android 10+
                } else {
                    permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // For Android 9 and below
                }
            }

            const result = await check(permission);
            console.warn("result" + JSON.stringify(result));

            if (result === RESULTS.GRANTED) {
                if (allowPdf) {
                    setModalVisible(true);
                } else {
                    openDocumentPicker();
                }
            } else if (result === RESULTS.DENIED) {
                const status = await request(permission);
                if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
                    Alert.alert(
                        "Permission Needed",
                        `Allow Captain App to access your media and files from device settings to continue`,
                        [
                            {
                                text: "Cancel",
                                onPress: () => {},
                                style: "cancel"
                            },
                            {
                                text: "Go to settings",
                                onPress: () => {openSettings();},
                                style: "default"
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (status === RESULTS.GRANTED) {
                    if (allowPdf) {
                        setModalVisible(true);
                    } else {
                        openDocumentPicker();
                    }
                }
            } else if (result === RESULTS.BLOCKED) {
                const status = await request(permission);
                if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
                    Alert.alert(
                        "Permission Needed",
                        `Allow Captain App to access your media and files from device settings to continue`,
                        [
                            {
                                text: "Cancel",
                                onPress: () => {},
                                style: "cancel"
                            },
                            {
                                text: "Ok",
                                onPress: () => {openSettings();},
                                style: "default"
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (status === RESULTS.GRANTED) {
                    if (allowPdf) {
                        setModalVisible(true);
                    } else {
                        openDocumentPicker();
                    }
                }
            }
        } catch (error) {
            console.error("Error checking file upload permission:", error);
        }
    };

    const checkCameraPermission = async () => {
        try {
            let permission;

            if (Platform.OS === "ios") {
                permission = PERMISSIONS.IOS.CAMERA;
            } else {
                permission = PERMISSIONS.ANDROID.CAMERA;
            }

            const result = await check(permission);
            console.warn("result" + JSON.stringify(result));

            if (result === RESULTS.GRANTED) {
                console.log("Camera permission is granted.");
                openCamera();
            } else if (result === RESULTS.DENIED) {
                const status = await request(permission);
                if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
                    Alert.alert(
                        "Permission Needed",
                        `Allow Captain App to access your camera from device settings to continue`,
                        [
                            {
                                text: "Cancel",
                                onPress: () => {},
                                style: "cancel"
                            },
                            {
                                text: "Go to settings",
                                onPress: () => {openSettings();},
                                style: "default"
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (status === RESULTS.GRANTED) {
                    openCamera();
                }
            } else if (result === RESULTS.BLOCKED) {
                const status = await request(permission);
                if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
                    Alert.alert(
                        "Permission Needed",
                        `Allow Captain App to access your camera from device settings to continue`,
                        [
                            {
                                text: "Cancel",
                                onPress: () => {},
                                style: "cancel"
                            },
                            {
                                text: "Ok",
                                onPress: () => {openSettings();},
                                style: "default"
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (status === RESULTS.GRANTED) {
                    openCamera();
                }
            }
        } catch (error) {
            console.error("Error checking camera permission:", error);
        }
    };

    const fileopen = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: DocumentPicker.types.pdf
            });
            setModalVisible(false);

            if (result[0].uri) {
                const fileSizeInBytes = result[0].size;

                if (fileSizeInBytes <= MAX_FILE_SIZE_BYTES) {
                    if (result[0].type === "application/pdf") {
                        const fileContent = await RNFS.readFile(result[0].uri, "base64");

                        Base64.setValue(fileContent);
                        Type?.setValue(result[0].type);
                    }
                    if (
                        result[0].type === "image/png" ||
                        result[0].type === "image/jpeg" ||
                        result[0].type === "image/jpg"
                    ) {
                        try {
                            const compressedImageUri = await I.compress(result[0].uri, {
                                compressionMethod: "manual",
                                quality: qual ? Number(qual.value) : 0.6
                            });
                            {
                                const fileContents = await RNFS.stat(compressedImageUri);
                                const value = ImagePicker.openCropper({
                                    path: compressedImageUri,
                                    width: 300,
                                    height: 400,
                                    freeStyleCropEnabled: true,
                                    includeBase64: true,
                                    compressImageQuality: 1
                                });
                                Base64.setValue((await value).data);
                                Type?.setValue(result[0].type);
                                console.warn("size after compression- " + fileContents.size);
                            }
                        } catch (error) {
                            console.warn("Error picking document:", error);
                        }
                        if (result[0].type === "video/mp4") {
                            Base64.setValue("");
                            Type?.setValue("");

                            Alert.alert(
                                "Information",
                                `File format is not supported. Kindly upload another file`,
                                [
                                    {
                                        text: "Ok",
                                        onPress: () => {},
                                        style: "default"
                                    }
                                ],
                                { cancelable: false }
                            );
                        }
                        setModalVisible(false);
                    }
                } else {
                    Alert.alert(
                        "Information",
                        `The selected file exceeds the maximum allowed size of ${
                            MAX_FILE_SIZE_BYTES / 1024 / 1024
                        } MB.`,
                        [
                            {
                                text: "Ok",
                                onPress: () => {},
                                style: "default"
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        } catch (error) {
            console.warn("Error picking document:", error);
        }
    };
    const fileopen1 = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: DocumentPicker.types.images
            });
            setModalVisible(false);

            if (result[0].uri) {
                const fileSizeInBytes = result[0].size;

                if (fileSizeInBytes <= MAX_FILE_SIZE_BYTES) {
                    if (result[0].type === "application/pdf") {
                        const fileContent = await RNFS.readFile(result[0].uri, "base64");

                        Base64.setValue(fileContent);
                        Type?.setValue(result[0].type);
                    }
                    if (
                        result[0].type === "image/png" ||
                        result[0].type === "image/jpeg" ||
                        result[0].type === "image/jpg"
                    ) {
                        try {
                            const compressedImageUri = await I.compress(result[0].uri, {
                                compressionMethod: "manual",
                                quality: qual ? Number(qual.value) : 0.6
                            });
                            {
                                const fileContents = await RNFS.stat(compressedImageUri);
                                const value = ImagePicker.openCropper({
                                    path: compressedImageUri,
                                    width: 300,
                                    height: 400,
                                    freeStyleCropEnabled: true,
                                    includeBase64: true,
                                    compressImageQuality: 1
                                });
                                Base64.setValue((await value).data);
                                Type?.setValue(result[0].type);
                                console.warn("size after compression- " + fileContents.size);
                            }
                        } catch (error) {
                            console.warn("Error picking document:", error);
                        }
                        if (result[0].type === "video/mp4") {
                            Base64.setValue("");
                            Type?.setValue("");

                            Alert.alert(
                                "Information",
                                `File format is not supported. Kindly upload another file`,
                                [
                                    {
                                        text: "Ok",
                                        onPress: () => {},
                                        style: "default"
                                    }
                                ],
                                { cancelable: false }
                            );
                        }
                        setModalVisible(false);
                    }
                } else {
                    Alert.alert(
                        "Information",
                        `The selected file exceeds the maximum allowed size of ${
                            MAX_FILE_SIZE_BYTES / 1024 / 1024
                        } MB.`,
                        [
                            {
                                text: "Ok",
                                onPress: () => {},
                                style: "default"
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        } catch (error) {
            console.warn("Error picking document:", error);
        }
    };

    const galleryopen = async () => {
        try {
            console.warn("Opening gallery");
            const result = await ImagePicker.openPicker({
                mediaType: "photo",
                cropping: true,
                freeStyleCropEnabled: true,
                enableRotationGesture: true
            });
            try {
                const compressedImageUri = await I.compress(result.path, {
                    compressionMethod: "manual",
                    quality: qual ? Number(qual.value) : 0.6
                });
                console.warn("quality" + qual?.value);
                setModalVisible(false);
                if (result.path) {
                    const fileSizeInBytes = result.size;
                    console.warn("size before compression- " + result.size);
                    if (fileSizeInBytes <= MAX_FILE_SIZE_BYTES) {
                        const fileContent = await RNFS.readFile(compressedImageUri, "base64");
                        const fileContents = await RNFS.stat(compressedImageUri);
                        console.warn("Image Taken and base64 converted");
                        Base64.setValue(fileContent);
                        Type?.setValue(result.mime);

                        console.warn("Image cropped and value set to attribute");
                        console.warn("size after compression- " + fileContents.size);
                        // ImagePicker.openCropper({
                        //     path: result.path,
                        //     width: 300,
                        //     height: 400,
                        //     freeStyleCropEnabled: true
                        // });
                    } else {
                        Alert.alert(
                            "Information",
                            `The selected file exceeds the maximum allowed size of ${
                                MAX_FILE_SIZE_BYTES / 1024 / 1024
                            } MB.`,
                            [
                                {
                                    text: "Ok",
                                    onPress: () => {},
                                    style: "default"
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            } catch (error) {
                console.warn("Error picking documents:", error);
            }
        } catch (error) {
            console.warn("Error picking documents:", error);
        }
    };

    const openDocumentPicker = async () => {
        if (allowPdf) {
            setModalVisible(true);
        } else {
            try {
                console.warn("Opening files");
                const result = await ImagePicker.openPicker({
                    mediaType: "photo",
                    cropping: true,
                    freeStyleCropEnabled: true,
                    enableRotationGesture: true
                });
                try {
                    const compressedImageUri = await I.compress(result.path, {
                        compressionMethod: "manual",
                        quality: qual ? Number(qual.value) : 0.6
                    });
                    if (result.path) {
                        const fileSizeInBytes = result.size;
                        console.warn("size before compression- " + result.size);
                        if (fileSizeInBytes <= MAX_FILE_SIZE_BYTES) {
                            const fileContent = await RNFS.readFile(compressedImageUri, "base64");
                            const fileContents = await RNFS.stat(compressedImageUri);
                            console.warn("Image Taken and base64 converted");
                            Base64.setValue(fileContent);
                            Type?.setValue(result.mime);
                            console.warn("size after compression- " + fileContents.size);
                            console.warn("Image cropped and value set to attribute");
                            // ImagePicker.openCropper({
                            //     path: result.path,
                            //     width: 300,
                            //     height: 400,
                            //     freeStyleCropEnabled: true
                            // });
                        } else {
                            Alert.alert(
                                "Information",
                                `The selected file exceeds the maximum allowed size of ${
                                    MAX_FILE_SIZE_BYTES / 1024 / 1024
                                } MB.`,
                                [
                                    {
                                        text: "Ok",
                                        onPress: () => {},
                                        style: "default"
                                    }
                                ],
                                { cancelable: false }
                            );
                        }
                    }
                } catch (error) {
                    console.warn("Error picking documents:", error);
                }
            } catch (error) {
                console.warn("Error picking documents:", error);
            }
        }
    };

    const openCamera = async () => {
        console.warn("opening camera");
        const response = await ImagePicker.openCamera({
            mediaType: "photo",
            cropping: true,
            freeStyleCropEnabled: true,
            enableRotationGesture: true
        });

        try {
            try {
                const compressedImageUri = await I.compress(response.path, {
                    compressionMethod: "manual",
                    quality: qual ? Number(qual.value) : 0.6
                });
                const fileSizeInBytes = response.size;
                if (fileSizeInBytes <= MAX_FILE_SIZE_BYTES) {
                    const fileContent = await RNFS.readFile(compressedImageUri, "base64");
                    const fileContents = await RNFS.stat(compressedImageUri);
                    console.warn("Image Taken and base64 converted");
                    Base64.setValue(fileContent);
                    Type?.setValue(response.mime);
                    console.warn("size before compression- " + response.size);
                    console.warn("Image cropped and value set to attribute");
                    console.warn("size after compression- " + fileContents.size);
                } else {
                    const fileContent = await RNFS.readFile(compressedImageUri, "base64");
                    const fileContents = await RNFS.stat(compressedImageUri);
                    console.warn("Image Taken and base64 converted");
                    Base64.setValue(fileContent);
                    Type?.setValue(response.mime);
                    console.warn("size before compression- " + response.size);
                    console.warn("Image cropped and value set to attribute");
                    console.warn("size after compression- " + fileContents.size);
                }
            } catch (error) {
                console.warn("Error picking documents:", error);
            }
        } catch (error) {
            console.warn("Error converting image to base64:", error);
        }
    };

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={uiStyles.modalContainer}>
                    <View style={uiStyles.modalView}>
                        <Text style={uiStyles.modalTitle}>Choose an option</Text>
                        <View style={uiStyles.modalView1}>
                            <View style={uiStyles.modalContainerin}>
                                <TouchableOpacity onPress={fileopen}>
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignContent: "center"
                                        }}
                                    >
                                        <SvgXml
                                            xml={fileUpload.value}
                                            width={containerWidth}
                                            height={containerHeight}
                                            style={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                paddingLeft: 3
                                            }}
                                        />
                                    </View>
                                    <Text style={uiStyles.modalText}>Upload File</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={uiStyles.modalOr}>Or</Text>
                            <View style={uiStyles.modalContainerin}>
                                <TouchableOpacity onPress={galleryopen}>
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignContent: "center"
                                        }}
                                    >
                                        <SvgXml
                                            xml={galleryupload.value}
                                            width={containerWidth}
                                            height={containerHeight}
                                            style={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignContent: "center"
                                            }}
                                        />
                                    </View>
                                    <Text style={uiStyles.modalText}>Open Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={uiStyles.modalClose}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {!onlyimage ? (
                !allowInvoice ? (
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingTop: "3%" }}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", justifyContent: "center" }}
                                onPress={checkCameraPermission}
                            >
                                <Image
                                    style={{ marginRight: "3%", resizeMode: "cover", marginLeft: "155%" }}
                                    source={logoCamera.value}
                                />
                                <Text style={{ color: "#000", width: "100%", marginTop: "1%" }}>Take a Picture</Text>
                            </TouchableOpacity>
                            <Text style={{ color: "rgba(0, 0, 0, 0.33)", paddingTop: "2%" }}>Or</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingTop: "2%" }}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", justifyContent: "center" }}
                                onPress={checkFileUploadPermission}
                            >
                                <Image
                                    style={{ marginRight: "3%", resizeMode: "cover", marginLeft: "135%" }}
                                    source={logoUpload.value}
                                />
                                <Text style={{ color: "#000", width: "100%", marginTop: "1%" }}>
                                    Upload from mobile
                                </Text>
                            </TouchableOpacity>
                            {allowPdf ? (
                                <Text
                                    style={{
                                        color: "rgba(0, 0, 0, 0.33)",
                                        paddingTop: "2%",
                                        width: "100%",
                                        textAlign: "center"
                                    }}
                                >
                                    Supported documents are JPEG, PNG and PDF
                                </Text>
                            ) : (
                                <Text
                                    style={{
                                        color: "rgba(0, 0, 0, 0.33)",
                                        paddingTop: "2%",
                                        width: "100%",
                                        textAlign: "center"
                                    }}
                                >
                                    Supported documents are JPEG and PNG
                                </Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={{ justifyContent: "center", paddingTop: "3%" }}>
                        <TouchableOpacity onPress={openCamera}>
                            <Image
                                style={{
                                    marginRight: "3%",
                                    resizeMode: "cover",
                                    height: containerHeight,
                                    width: containerWidth
                                }}
                                source={logoInvoice.value}
                            />
                        </TouchableOpacity>
                    </View>
                )
            ) : (
                <View style={{ justifyContent: "center", paddingTop: "3%" }}>
                    <TouchableOpacity onPress={settrue}>
                        <SvgXml
                            xml={logoUpload.value}
                            width={containerWidth}
                            height={containerHeight}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                alignContent: "center",
                                paddingLeft: 3
                            }}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const uiStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        padding: 20,
        borderRadius: 10,
        elevation: 5
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007bff",
        padding: 15,
        margin: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10
    },
    logo: {
        width: 30,
        height: 30
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 8
    },
    modalContainerin: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 8,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        textAlign: "center",

        width: 130,
        height: 110
    },
    modalView: {
        width: 330,
        height: 220,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: "center"
    },
    modalView1: { flexDirection: "row", flex: 1 },

    modalTitle: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
        marginBottom: 15,

        justifyContent: "flex-start"
    },
    modalOr: {
        fontSize: 14,
        color: "#00000066",
        paddingTop: 45,
        padding: 8
    },
    modalText: {
        fontSize: 14,
        color: "#00000066",
        textAlign: "center",
        justifyContent: "center"
    },
    modalClose: {
        fontSize: 14,
        color: "#73A733",
        justifyContent: "center"
    },
    modalButton: {
        backgroundColor: "#007bff",
        borderRadius: 10,
        padding: 10,
        margin: 5,
        width: "100%",
        alignItems: "center"
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16
    }
});
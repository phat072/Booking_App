import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GiftedChat, Bubble, Send, InputToolbar, IMessage } from 'react-native-gifted-chat';
import  Colors  from '@/constants/Colors';
import EmojiModal from 'react-native-emoji-modal';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { API_URL } from '@env';

interface ChatRouteParams {
    id: string;
    userId: string;
    userName : string;
}

interface ChatProps {
    route: { params: ChatRouteParams };
}

const ChatScreen: React.FC<ChatProps> = ({ route }) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const chatId = route.params.id;
    const userId = route.params.userId
    const userName = route.params.userName
    const userAvatar = 'https://i.pravatar.cc/200';

    // Fetch messages from backend (`${API_URL}/address/${userId}`)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get<IMessage[]>(`${API_URL}/messages/${chatId}`);
                setMessages(
                    response.data.map((msg) => ({
                        ...msg,
                        createdAt: new Date(msg.createdAt),
                    }))
                );
            } catch (err) {
                console.error('Failed to fetch messages:', err);
            }
        };

        fetchMessages();
    }, [chatId]);

    // Send a new message
    const onSend = useCallback(
        async (m: IMessage[] = []) => {
            try {
                const newMessage: IMessage = {
                    ...m[0],
                    createdAt: new Date(),
                    user: {
                        _id: userId,
                        name: userName,
                        avatar: userAvatar,
                    },
                };

                const response = await axios.post<IMessage[]>(`${API_URL}/messages/${chatId}`, { newMessage });
                setMessages(
                    response.data.map((msg) => ({
                        ...msg,
                        createdAt: new Date(msg.createdAt),
                    }))
                );
            } catch (err) {
                console.error('Failed to send message:', err);
            }
        },
        [chatId]
    );

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            await uploadImageAsync(result.assets[0].uri);
        }
    };

    const uploadImageAsync = async (uri: string) => {
        setUploading(true);
        const formData = new FormData();
        const file = {
            uri,
            name: `${uuid.v4()}.jpg`,
            type: 'image/jpeg',
        } as any;

        formData.append('file', file);

        try {
            const response = await axios.post<{ url: string }>(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = response.data.url;

            onSend([
                {
                    _id: uuid.v4() as string,
                    createdAt: new Date(),
                    text: '',
                    image: imageUrl,
                    user: {
                        _id: userId,
                        name: userName,
                        avatar: userAvatar,
                    },
                },
            ]);
        } catch (err) {
            console.error('Failed to upload image:', err);
        } finally {
            setUploading(false);
        }
    };

    const renderBubble = useMemo(
        () => (props: any) => (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: Colors.primary },
                    left: { backgroundColor: 'lightgrey' },
                }}
            />
        ),
        []
    );

    const renderSend = useMemo(
        () => (props: any) => (
            <>
                <TouchableOpacity style={styles.addImageIcon} onPress={pickImage}>
                    <View>
                        <Ionicons name='attach-outline' size={32} color={Colors.teal} />
                    </View>
                </TouchableOpacity>
                <Send {...props}>
                    <View style={{ justifyContent: 'center', height: '100%', marginLeft: 8, marginRight: 4, marginTop: 12 }}>
                        <Ionicons name='send' size={24} color={Colors.teal} />
                    </View>
                </Send>
            </>
        ),
        []
    );

    const renderInputToolbar = useMemo(
        () => (props: any) => (
            <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                renderActions={renderActions}
            />
        ),
        []
    );

    const renderActions = useMemo(
        () => () => (
            <TouchableOpacity style={styles.emojiIcon} onPress={handleEmojiPanel}>
                <View>
                    <Ionicons name='happy-outline' size={32} color={Colors.teal} />
                </View>
            </TouchableOpacity>
        ),
        [modal]
    );

    const handleEmojiPanel = useCallback(() => {
        setModal(!modal);
    }, [modal]);

    return (
        <>
            {uploading && (
                <View style={styles.loadingContainerUpload}>
                    <ActivityIndicator size='large' color={Colors.teal} />
                </View>
            )}
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: userId,
                    name: userName,
                    avatar: userAvatar,
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderInputToolbar={renderInputToolbar}
                minInputToolbarHeight={56}
            />
            {modal && (
                <EmojiModal
                    onPressOutside={handleEmojiPanel}
                    onEmojiSelected={(emoji) => {
                        onSend([
                            {
                                _id: uuid.v4() as string,
                                createdAt: new Date(),
                                text: emoji || '',
                                user: {
                                    _id: userId,
                                    name: userName,
                                    avatar: userAvatar,
                                },
                            },
                        ]);
                    }}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    addImageIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginLeft: 4,
    },
    inputToolbar: {
        backgroundColor: '#f0f0f0',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingHorizontal: 8,
        minHeight: 56,
    },
    emojiIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginRight: 8,
    },
    loadingContainerUpload: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});

export default ChatScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";

export const posts = [
  {
    id: "1",
    user: {
      name: "Trần Lê Anh Khoa",
      avatar:
        "https://scontent.fsgn22-1.fna.fbcdn.net/v/t39.30808-6/459698472_122114032892496575_1764754806751191731_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHkQ-DuTc2QtG1BG6h-rUqQiQSqrA2ApNaJBKqsDYCk1p5GauFTp3jDLIVqI-viUgD9gDhF1ifgh7LX3_pCMSXg&_nc_ohc=C1dK28ycuA8Q7kNvgEcHiL3&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=AqzFQBhzx5RgGWzb1nLGMWC&oh=00_AYDV228-EwTb3XmSYAPTeECVGOMI5o4ky8GM7xFAneUd6w&oe=67560443",
    },
    content: "Sương sương sang chảnh",
    restaurant: "D'Maris Lotte Mart Quận 7",
    image:
      "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-dmaris-lotte-mart-quan-7-5-normal-1881561449671.webp",
    likes: 12,
    comments: [
      { id: "1", user: "Đào Đại Chí", text: "Quán nay ngon bá cháy!" },
      { id: "2", user: "Lê Thị Lựu", text: "Tuần nào cũng phải ăn 1 bữa" },
    ],
  },
  {
    id: "2",
    user: {
      name: "Phan Cả Phát",
      avatar: "https://scontent.fsgn22-1.fna.fbcdn.net/v/t1.6435-9/116068554_3095458534013850_4107421752621901848_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGAIaZARDap9ZyB-GoSsgh3_pS9OQEYPr7-lL05ARg-vo2fxPlkiEGUpsFhnzpGDtaKOEEXcEvzVl1-RuHBatQ8&_nc_ohc=b8DXKuvPIO4Q7kNvgHlJhUx&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=AJNwzNGrKxJvQMO5xS5cAx_&oh=00_AYDFI0oJtUfk_26gITykQhMzu4feX-vduOzT6rYxxCPo8w&oe=6777AD2A",
    },
    content: "Không gian rộng rãi, thích hợp tổ chức sinh nhật.",
    restaurant: "Gyu Shige Ngưu Phồn - Nguyễn Thị Minh Khai",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-gyu-shige-nguu-phon-nguyen-thi-minh-khai-9-normal-472391429473.webp",
    likes: 25,
    comments: [{ id: "1", user: "Nguyễn Đức Huy", text: "Sang xịn mịn" }],
  },
];

export const PostItem = ({ post }: { post: any }) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { id: `${comments.length + 1}`, user: "Bạn", text: newComment },
      ]);
      setNewComment("");
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{post.user.name}</Text>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <Text style={styles.restaurant}>ở tại nhà hàng {post.restaurant}</Text>
      {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
      <View style={styles.postActions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Text>{isLiked ? "💔 Unlike" : "👍 Like"} ({likes})</Text>
        </TouchableOpacity>
        <Text>💬 {comments.length} Comments</Text>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentUser}>{item.user}:</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Thêm bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
          <Text style={styles.addCommentText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButton: {
    padding: 5,
  },
  restaurant: {
    fontStyle: "italic",
    color: "#555",
    marginBottom: 10,
  },  
  comment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  commentUser: {
    fontWeight: "bold",
    marginRight: 5,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addCommentButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  addCommentText: {
    color: "#fff",
  },
});

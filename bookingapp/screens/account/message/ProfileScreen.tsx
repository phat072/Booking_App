import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import InstaStory from 'react-native-insta-story';

const ProfileScreen: React.FC = () => {
  const channels = [
    {
      id: '0',
      name: 'Đỗ Mai Minh Quân',
      image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.6435-1/176331669_764953784389515_6626489980642988554_n.jpg?stp=dst-jpg_s200x200&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=dOTUtuhIPh4Q7kNvgGKg0ds&_nc_zt=24&_nc_ht=scontent.fhan4-3.fna&_nc_gid=ApLiYPnhVesV3AK-UH0TRGI&oh=00_AYBSMPg7vg2mJlenoA64Lqi7SFIm3OBSc1Q26Xb8S0mqag&oe=67769C4D',
      text: 'Anh doremon gọi bằng đt luôn :)))',
      date: '2:45 AM',
      status_text: 'read',
      status: 'online',
    },
    {
      id: '1',  
      name: 'leomessi',
      image: 'https://instagram.fhan3-1.fna.fbcdn.net/v/t51.2885-19/424905549_7243065989106669_45026390061580919_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fhan3-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=-TN2ZgQHJbIQ7kNvgGYxa1y&_nc_gid=dcf1475c895845588db37bf81b96642d&edm=AEYEu-QBAAAA&ccb=7-5&oh=00_AYAAYnrsgnZmjiwMxxE15ROxV96q3xwTTrWXWivitO1Mww&oe=67550CB1&_nc_sid=ead929',
      text: 'Hey bruh, do you want to join in Barcelona ??',
      date: '2:45 AM',
      status_text: 'read',
      status: 'offline',
    },
    {
      id: '2', 
      name: 'Đào Đại Chí',
      image: 'https://scontent.fhan3-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=nhHrY9pzliIQ7kNvgGK_8fz&_nc_zt=24&_nc_ht=scontent.fhan3-1.fna&_nc_gid=AfIbhMGZxJnDf6oeHZb7oQB&oh=00_AYB9betN81OavxTWmOBEiyd4k-1YtkHVbK6pI2sA0b-Tew&oe=67768C7A',
      text: 'Ê mượn cái tai nghe coi',
      date: '1:45 PM',
      status_text: 'unread',
      status: 'online',
    },
    {
      id: '3',
      name: 'Nguyễn Sang',
      image: 'https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/422863420_1853948445008589_2774770990605586355_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=csfT9Qs-mpMQ7kNvgEl5AuQ&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=AGjCe_6xiRWs0p9INpkrT7s&oh=00_AYCO_Ootvn2cGZ8g0C9-MYttA33fpUDTtdaZyOJ9cLpz3A&oe=67550583',
      text: 'bồ t không thích làm việc văn phòng thôi',
      date: '2:45 AM',
      status_text: 'read',
      status: 'offline',
    },
    {
      id: '4',  
      name:'Trần Lê Anh Khoa',
      image:'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-1/459698472_122114032892496575_1764754806751191731_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=6i_yHUk1pwIQ7kNvgF7Vrr0&_nc_zt=24&_nc_ht=scontent.fhan4-3.fna&_nc_gid=AfktDqKMfU8hXtxJTYNM_yb&oh=00_AYAEuIXwbbUu1PH25l_QgKTB5NEigGf1AFro0au8yAh_PQ&oe=6754F7E8  ',
      text: 'nó bảo nat test lỗi hệ thống r',
      date: '2:45 AM',
      status_text: 'unread',
      status: 'online',
    },
  ];
  const data = [
    {
      user_id: 1,
      user_image:
        'https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-1/356690277_261481316492261_1656113772752209275_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=lOo5cdcGMkQQ7kNvgGsNq4t&_nc_zt=24&_nc_ht=scontent.fhan3-4.fna&_nc_gid=AusvdcwJGN8DkVCp64q1j7C&oh=00_AYAHUZOO1K_aKsdao3qOKbRhiAROGwjZmiXiEgJnswo3Xw&oe=6754F9FB',
      user_name: 'Phạm Cảnh',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
        },
      ],
    },
    {
      user_id: 2,
      user_image: 'https://scontent.fhan4-5.fna.fbcdn.net/v/t39.30808-1/444482985_3793938064159631_3189895615862713800_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=zyTvVNfzvkcQ7kNvgGzofO0&_nc_zt=24&_nc_ht=scontent.fhan4-5.fna&_nc_gid=AbzwcZrnce8hwuiLhqsInxo&oh=00_AYD-Nzy9_plGu92lzUQsnEppadNLx8UR-qwj99U5pfxj4A&oe=675509B8',
      user_name: 'Trường Lê',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 2 swiped'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.updatesContainer}>
        <Text style={styles.headerText}>Updates</Text>

        <View style={styles.userSection}>
          <View style={styles.userProfile}>
            <Pressable>
              <Image
                style={styles.userImage}
                source={{
                  uri: 'https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/468882816_4869318963293503_3408578698215792344_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1Arg1VKA_6EQ7kNvgGxLNm9&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=A-7vKKpsuzvrWmlpvi31F6p&oh=00_AYDZ5feGe_1OBxP1aFeb9a5WKzoX5NqMrSA7PPFS-0sypA&oe=6754FAC6',
                }}
              />
              <Text style={styles.userName}>Your note</Text>
            </Pressable>
          </View>
          <InstaStory data={data} duration={10}  />
        </View>
      </View>

      <View style={styles.channelsContainer}>
        <Text style={styles.headerText}>Channels</Text>
        {channels?.map((item, index) => (
          <View style={styles.channelItem} key={index}>
            <Image
                source={{ uri: item.image }}
                style={styles.channelImage}
              />
              {item.status === 'online' && (
                <View style={styles.statusIndicator} />
              )}
            <View style={styles.channelText}>
              <Text style={styles.channelName}>{item.name}</Text>
              <Text
                  style={[
                    styles.channelTextDescription,
                    item.status_text === 'unread' && styles.boldText, // Apply bold if unread
                  ]}
                >
                  {item.text}
              </Text>
            </View>
            <Text style={styles.channelDate}>{item.date}</Text>
          </View>        
        ))}

        <View style={styles.stickerContainer}>
          <Image
            style={styles.stickerImage}
            source={{
              uri: 'https://signal.org/assets/images/features/Stickers.png',
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  updatesContainer: {
    padding: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  userProfile: {
    marginTop: 10,
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 29,
    marginTop: -10,
  },
  userName: {
    textAlign: 'center',
    marginTop: 2.5,
    fontSize: 12.5,
  },
  channelsContainer: {
    padding: 10,
  },
  channelItem: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  channelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'relative',
  },
  channelText: {
    flex: 1,
  },
  channelName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  channelTextDescription: {
    marginTop: 4,
    color: 'gray',
  },
  channelDate: {
    fontSize: 14,
    color: 'gray',
  },
  stickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  stickerImage: {
    width: 120,
    height: 120,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
  },
  statusIndicator: {
    position: 'absolute', // Absolutely position the status circle within the image
    bottom: 0,
    left: 0,
    marginLeft: 39,
    width: 13,
    height: 13,
    borderRadius: 6,
    backgroundColor: 'green',
    borderWidth: 2, 
    borderColor: 'white', 
  },
});

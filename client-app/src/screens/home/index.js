import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PressableIcon from '../../components/PressableIcon';
import {
  faCirclePlus,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import DefaultBox from '../../components/DefaultBox';
import DefaultView from '../../components/DefaultView';
import {getServer} from '../../api';

const HomeScreen = ({navigation}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getServer('user/getActions')
      .then(r => {
        console.log(r.data);
        setList(r.data);
      })
      .catch(e => console.log(e));
  }, []);

  function deleteId(id: string) {
    console.log(id);
    setList(list.filter(item => item.id !== id));
  }

  return (
    <>
      <DefaultView>
        <Text style={styles.mainText}>Select or edit your action</Text>
        <View style={styles.boxesView}>
          <DefaultBox>
            <View style={styles.boxTextView}>
              <Text style={styles.boxBoldText}>Do </Text>
              <Text style={styles.boxText} numberOfLines={1}>
                Spotify Play Music
              </Text>
              <Text style={styles.boxBoldText}>When </Text>
              <Text style={styles.boxText} numberOfLines={1}>
                New Email
              </Text>
            </View>
            <View style={styles.boxIconView}>
              <PressableIcon icon={faPencil} size={30} />
              <PressableIcon
                icon={faTrash}
                size={30}
                onPress={() => console.log('Pen pressed')}
              />
            </View>
          </DefaultBox>
          {list.map(item => {
            return (
              <DefaultBox key={item.id}>
                <View style={styles.boxTextView}>
                  <Text style={styles.boxBoldText}>Do </Text>
                  <Text style={styles.boxText} numberOfLines={1}>
                    {item.do}
                  </Text>
                  <Text style={styles.boxBoldText}>When </Text>
                  <Text style={styles.boxText} numberOfLines={1}>
                    {item.when}
                  </Text>
                </View>
                <View style={styles.boxIconView}>
                  <PressableIcon icon={faPencil} size={30} />
                  <PressableIcon
                    icon={faTrash}
                    size={30}
                    onPress={() => deleteId(item.id)}
                  />
                </View>
              </DefaultBox>
            );
          })}
          <DefaultBox>
            <View style={styles.boxTextView}>
              <Text style={styles.boxBoldText}>Do </Text>
              <Text style={styles.boxText} numberOfLines={1}>
                Tweet `Hello world!`
              </Text>
              <Text style={styles.boxBoldText}>When </Text>
              <Text style={styles.boxText} numberOfLines={1}>
                New commit from Curtis
              </Text>
            </View>
            <View style={styles.boxIconView}>
              <PressableIcon icon={faPencil} size={30} />
              <PressableIcon
                icon={faTrash}
                size={30}
                onPress={() => console.log('Pen pressed')}
              />
            </View>
          </DefaultBox>
          <DefaultBox padding={0} style={{backgroundColor: 'lightgreen'}}>
            <PressableIcon
              icon={faCirclePlus}
              size={80}
              style={{width: '100%', height: '100%', borderRadius: 40}}
              onPress={() => navigation.navigate('Add')}
            />
          </DefaultBox>
        </View>
      </DefaultView>
    </>
  );
};

const styles = StyleSheet.create({
  boxesView: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  boxTextView: {
    width: '70%',
    justifyContent: 'space-around',
  },
  boxIconView: {
    maxWidth: '30%',
    justifyContent: 'space-evenly',
  },
  mainText: {
    textAlignVertical: 'center',
    height: 70,
    color: 'black',
    fontSize: 30,
  },
  boxText: {
    color: 'black',
    fontSize: 20,
  },
  boxBoldText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

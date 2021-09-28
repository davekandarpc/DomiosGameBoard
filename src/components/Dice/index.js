import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { styles } from './styles';
import { getHeight, getWidth } from '../../common/functions'

export class Dice extends Component {
  render() {
    // console.log("this.props.endToBeAdded : "+this.props.endToBeAdded)
    // console.log("this.props.index : "+this.props.index)
    // console.log("this.props.length : "+this.props.length)
    return (
      <TouchableOpacity
        style={[styles.dice,
          {
            width : this.props.mainPanel && this.props.length > 10 ? getWidth() / 25 : getWidth() / 20,
            height : this.props.mainPanel && this.props.length > 10 ? 55 : 60,
            // top : this.props.mainPanel && this.props.item.endToBeAdded == up ?
            transform: ([{ rotate:this.props.endToBeAdded == 'up' ? '10deg' : '0deg' }]),
          },
        {
          borderColor: this.props.diceBorderColor ? this.props.diceBorderColor : '#fff',
          marginHorizontal: this.props.mainPanel ? 0 :this.props.upperDotsNumber === this.props.lowerDotsNumber ? 1:5,
          // marginLeft:this.props.upperDotsNumber === this.props.lowerDotsNumber ? 1:1
        },
        this.props.rotateValue && {
          transform: ([{rotate: this.props.upperDotsNumber === this.props.lowerDotsNumber ? '180deg' : this.props.rotateValue }]),
          marginHorizontal:this.props.upperDotsNumber === this.props.lowerDotsNumber ? 1: 15
        },
        this.props.marginHorizontal && {
          marginHorizontal: this.props.marginHorizontal
        },
        this.props.marginTop && {
          marginTop: this.props.marginTop
        }
        ]}
        onPress={this.props.onPress}>
        {
          this.props.bornYard === undefined &&
          <View style={[styles.upperDotsContainer,{
            backgroundColor:this.props.isUserBlock != undefined && this.props.isUserBlock == true && this.props.upperLocked == true && this.props.index== this.props.length ? 'red' :null
            }]}>
            {
              [...Array(this.props.upperDotsNumber)].map((diceItem, index) => {
                return (
                  <View style={[styles.dot,{
                    width : this.props.mainPanel && this.props.length > 10 ? getWidth() / 120 : getWidth() / 125,   // 5 : 6,
                    height : this.props.mainPanel && this.props.length > 10 ? getWidth() / 120 : getWidth() / 125   // 5 : 6
                  }]} />
                )
              })
            }
          </View>
        }
        {
          this.props.bornYard === undefined &&
          <View style={[styles.lowerDotsContainer,{
            backgroundColor:this.props.isUserBlock != undefined && this.props.isUserBlock == true  && this.props.lowerLocked== true && this.props.index== this.props.length ? 'red' :null
            // backgroundColor: this.props.isUserBlock == true && this.props.rotateValue == '-90deg' && 'gray'
          }]}>
            {
              [...Array(this.props.lowerDotsNumber)].map((diceItem, index) => {
                return (
                  <View style={[styles.dot,{
                    width : this.props.mainPanel && this.props.length > 10 ? getWidth() / 120 : getWidth() / 125, // 5 : 6,
                    height : this.props.mainPanel && this.props.length > 10 ? getWidth() / 120 : getWidth() / 125 // 5 : 6
                  }]} />
                )
              })
            }
          </View>
        }
        {
          this.props.bornYard &&
          <Text style={styles.bornYardDominoStyle}>Domino</Text>
        }
      </TouchableOpacity>
    );
  }
}
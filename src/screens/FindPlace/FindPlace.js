import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {connect} from 'react-redux';
import PlaceList from '../../components/PlaceList/PlaceList';
import * as actions from '../../store/actions/index';

class FindPlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: '#003366'
    };
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    state = {
      placesLoaded: false,
        removeAnimation: new Animated.Value(1),
        fadeInAnimation: new Animated.Value(0)
    };

    componentDidMount() {
        this.props.onLoadPlaces();
    }

    onNavigatorEvent = (event) => {
        if (event.type === 'NavBarButtonPress') {
            if(event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                this.props.onLoadPlaces();
            }
        }
    };

    itemSelectedHandler = key => {
        const selectedPlace = this.props.places.find(place => place.key === key);
        this.props.navigator.push({
            screen: 'places-app.PlaceDetailScreen',
            title: selectedPlace.name,
            passProps: {
                selectedPlace: selectedPlace
            }
        });
    };

    placesSearchHandler = () => {
        Animated.timing(this.state.removeAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                placesLoaded: true
            });
            this.placesLoadedHandler();
        });
    };

    placesLoadedHandler = () => {
        Animated.timing(this.state.fadeInAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    };

    render() {
        let content = (
            <Animated.View
                style={{
                    opacity: this.state.removeAnimation,
                    transform: [
                        {
                            scale: this.state.removeAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [12, 1]
                            })
                        }
                    ]
                }}>
                <TouchableOpacity onPress={this.placesSearchHandler}>
                    <View style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Find Places</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
        if (this.state.placesLoaded) {
            content = (
                <Animated.View
                    style={{
                        opacity: this.state.fadeInAnimation,
                        transform: [
                            {
                                scale: this.state.fadeInAnimation
                            }
                        ]
                    }}>
                <PlaceList
                    places={this.props.places} onItemSelected={this.itemSelectedHandler}/>
                </Animated.View>
            )
        }
        return (
            <View style={this.state.placesLoaded ? null : styles.buttonContainer}>
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    searchButton: {
        borderColor: '#003366',
        borderRadius: 50,
        padding: 10,
        borderWidth: 3,
        backgroundColor: '#b7dbff'
    },
    searchButtonText: {
        color: '#003366',
        fontWeight: 'bold',
        fontSize: 26
    }
});

const mapStateToProps = state => {
    return {
        places: state.places.places
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPlaces: () => dispatch(actions.getPlaces())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);

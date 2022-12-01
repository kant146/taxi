import React, { useRef } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Text,
    Platform,
    Modal,
    StatusBar
} from 'react-native';
import { Icon, Button, Header } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { colors } from '../common/theme';
var { width, height } = Dimensions.get('window');
import i18n from 'i18n-js';
const hasNotch = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && ((height === 780 || width === 780) || (height === 812 || width === 812) || (height === 844 || width === 844) || (height === 896 || width === 896) || (height === 926 || width === 926))

export default function taxiModal(props) {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { settings, tripdata, estimate, bookingModalStatus, onPressCancel, bookNow } = props;

    const mapRef = useRef(null);

    const runFitCoords = () => {
        mapRef.current.fitToCoordinates([{ latitude: tripdata.pickup.lat, longitude: tripdata.pickup.lng }, { latitude: tripdata.drop.lat, longitude: tripdata.drop.lng }], {
            edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
            animated: true,
        });
    };

    return (
        <View>
            <StatusBar
                hidden={false}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={bookingModalStatus}
                onShow={runFitCoords}
            >
                <View style={styles.container}>
                    <View style={styles.mapcontainer}>
                        {tripdata && tripdata.pickup && tripdata.drop ?
                            <MapView
                                ref={mapRef}
                                style={styles.map}
                                provider={PROVIDER_GOOGLE}
                                initialRegion={{
                                    latitude: (tripdata.pickup.lat),
                                    longitude: (tripdata.pickup.lng),
                                    latitudeDelta: 0.9922,
                                    longitudeDelta: 1.9421
                                }}
                                minZoomLevel={13}
                            >
                                <Marker
                                    coordinate={{ latitude: (tripdata.pickup.lat), longitude: (tripdata.pickup.lng) }}
                                    title={tripdata.pickup.add}
                                    pinColor={colors.GREEN_DOT}
                                >
                                </Marker>


                                <Marker
                                    coordinate={{ latitude: (tripdata.drop.lat), longitude: (tripdata.drop.lng) }}
                                    title={tripdata.drop.add}
                                >
                                </Marker>

                                {estimate && estimate.waypoints ?
                                    <MapView.Polyline
                                        coordinates={estimate.waypoints}
                                        strokeWidth={5}
                                        strokeColor={colors.INDICATOR_BLUE}
                                        lineDashPattern={[1]}
                                    />
                                    : null}

                                {tripdata.drop && tripdata.drop.waypoints && tripdata.drop.waypoints.length > 0 ? tripdata.drop.waypoints.map((item, index) => {
                                    return (
                                        <Marker
                                            coordinate={{ latitude: item.lat, longitude: item.lng }}
                                            pinColor={colors.RED}
                                            title={item.add}
                                            key={index}
                                        >
                                        </Marker>

                                    )
                                })
                                    : null}
                            </MapView>
                            : null}
                    </View>
                    <View style={[isRTL ? styles.topTitle1 : styles.topTitle, { width: 155 }]}>
                        <Text style={{ marginHorizontal: 7, textAlign: 'center', color: '#517fa4', fontFamily: 'Roboto-Bold', fontSize: 18, }}>{t('confirm_booking')}</Text>
                    </View>
                    <View style={[styles.addressBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.ballandsquare}>
                            <View style={styles.hbox1} /><View style={styles.hbox2} /><View style={styles.hbox3} />
                        </View>
                        {tripdata && tripdata.pickup && tripdata.drop ?
                            <View style={[styles.contentStyle, isRTL ? { paddingRight: 10 } : { paddingLeft: 10 }]}>
                                <TouchableOpacity style={styles.addressStyle1}>
                                    <Text numberOfLines={1} style={styles.textStyle}>{tripdata.pickup.add}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addressStyle2}>
                                    <Text numberOfLines={1} style={styles.textStyle}>{tripdata.drop.add}</Text>
                                </TouchableOpacity>
                            </View>
                            : null}
                    </View>


                    <View style={styles.bottomContainer}>
                        <View style={styles.offerContainer}>
                            <TouchableOpacity >
                                <Text style={styles.offerText}> {t('estimate_fare_text')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.priceDetailsContainer}>
                            <View style={styles.priceDetailsLeft}>
                                <View style={styles.priceDetails}>
                                    <View style={styles.totalFareContainer}>
                                        <Text style={styles.totalFareText}>{t('total_fare')}</Text>
                                    </View>
                                    <Icon
                                        name='info'
                                        color={colors.WHITE}
                                        type='simple-line-icon'
                                        size={15}
                                        containerStyle={styles.infoIcon}
                                    />
                                </View>

                                <View style={styles.iconContainer}>
                                    {settings.swipe_symbol === false ?
                                        <Text style={styles.priceText}> {settings ? settings.symbol : null} {estimate ? estimate.estimateFare : null}</Text>
                                        :
                                        <Text style={styles.priceText}> {estimate ? estimate.estimateFare : null} {settings ? settings.symbol : null}</Text>
                                    }
                                </View>

                            </View>
                            <View style={styles.priceDetailsMiddle}>
                                <View style={styles.triangle} />
                                <View style={styles.lineHorizontal} />
                            </View>
                            <View style={styles.priceDetailsLeft}>
                                <View style={styles.priceDetails}>
                                    <View style={styles.totalFareContainer}>
                                        <Text style={styles.totalFareText}>{estimate && estimate.estimateDistance ? parseFloat(estimate.estimateDistance).toFixed(settings.decimal) : 0} {settings && settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                    </View>
                                    <Icon
                                        name='info'
                                        color={colors.WHITE}
                                        type='simple-line-icon'
                                        size={15}
                                        containerStyle={styles.infoIcon}
                                    />
                                </View>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.priceText}>{estimate ? parseFloat(estimate.estimateTime / 60).toFixed(0) : 0} {t('mins')}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1.5, flexDirection: 'row' }}>
                            <View style={styles.iconContainer}>
                                <Button
                                    title={t('cancel')}
                                    loading={false}
                                    loadingProps={{ size: "large", color: colors.WHITE }}
                                    titleStyle={{ color: colors.WHITE, fontWeight: 'bold' }}
                                    onPress={onPressCancel}
                                    buttonStyle={{ height: '100%', backgroundColor: colors.DRIVER_TRIPS_TEXT }}
                                    containerStyle={{ height: '100%' }}
                                />
                            </View>
                            <View style={styles.flexView}>
                                <Button
                                    title={t('confirm')}
                                    loadingProps={{ size: "large", color: colors.BUTTON_LOADING }}
                                    titleStyle={{ color: colors.WHITE, fontWeight: 'bold' }}
                                    onPress={bookNow}
                                    buttonStyle={{ height: '100%', backgroundColor: colors.BUTTON_RIGHT }}
                                    containerStyle={{ height: '100%' }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.HEADER,
        borderBottomWidth: 0
    },
    headerInnerStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 18
    },
    container: {
        flex: 1,
        backgroundColor: colors.WHITE
    },
    topContainer: {
        flex: 1.5,
        flexDirection: 'row',
        borderTopWidth: 0,
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        paddingEnd: 15,
        borderWidth: 1,
    },
    topLeftContainer: {
        flex: 1.5,
        alignItems: 'center'
    },
    topRightContainer: {
        flex: 9.5,
        justifyContent: 'space-between',

    },
    circle: {
        height: 12,
        width: 12,
        borderRadius: 15 / 2,
        backgroundColor: colors.LIGHT_YELLOW
    },
    staightLine: {
        height: height / 25,
        width: 1,
        backgroundColor: colors.LIGHT_YELLOW
    },
    square: {
        height: 14,
        width: 14,
        backgroundColor: colors.FOOTERTOP
    },
    whereButton: { flex: 1, justifyContent: 'center', borderBottomColor: colors.BLACK, borderBottomWidth: 1 },
    whereContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    whereText: { flex: 9, fontFamily: 'Roboto-Regular', fontSize: 14, fontWeight: '400', color: colors.HEADER },
    iconContainer: { flex: 1 },
    dropButton: { flex: 1, justifyContent: 'center' },
    mapcontainer: {
        flex: 7,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    bottomContainer: { flex: 2, alignItems: 'center' },
    offerContainer: { flex: 1, backgroundColor: colors.Box_BG, width: width, justifyContent: 'center', borderBottomColor: colors.BUTTON_YELLOW, borderBottomWidth: Platform.OS == 'ios' ? 1 : 0 },
    offerText: { alignSelf: 'center', color: colors.MAP_TEXT, fontSize: 12, fontFamily: 'Roboto-Regular' },
    priceDetailsContainer: { flex: 2.3, backgroundColor: colors.WHITE, flexDirection: 'row', position: 'relative', zIndex: 1 },
    priceDetailsLeft: { flex: 19, height: 90 },
    priceDetailsMiddle: { flex: 2, height: 50, width: 1, alignItems: 'center' },
    priceDetails: { flex: 1, flexDirection: 'row' },
    totalFareContainer: { flex: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
    totalFareText: { color: colors.MAP_TEXT, fontFamily: 'Roboto-Bold', fontSize: 15, marginLeft: 40 },
    infoIcon: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    priceText: { alignSelf: 'center', color: colors.BUTTON, fontFamily: 'Roboto-Bold', fontSize: 20 },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: colors.TRANSPARENT,
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 10,
        borderLeftColor: colors.TRANSPARENT,
        borderRightColor: colors.TRANSPARENT,
        borderBottomColor: colors.Box_BG,
        transform: [
            { rotate: '180deg' }
        ],
        marginTop: -1, overflow: 'visible'
    },
    lineHorizontal: { height: height / 18, width: 1, backgroundColor: colors.BLACK, alignItems: 'center', marginTop: 10 },
    logoContainer: { flex: 19, alignItems: 'center', justifyContent: 'center' },
    logoImage: { width: 80, height: 80 },
    buttonsContainer: { flex: 1.5, flexDirection: 'row' },
    buttonText: { color: colors.WHITE, fontFamily: 'Roboto-Bold', fontSize: 17, alignSelf: 'flex-end' },
    buttonStyle: { backgroundColor: colors.DRIVER_TRIPS_TEXT, elevation: 0 },
    buttonContainerStyle: { flex: 1, backgroundColor: colors.DRIVER_TRIPS_TEXT },
    confirmButtonStyle: { backgroundColor: colors.BUTTON_RIGHT, elevation: 0 },
    confirmButtonContainerStyle: { flex: 1, backgroundColor: colors.BUTTON_RIGHT },

    flexView: {
        flex: 1
    },
    addressStyle2: {
        height: 48,
        width: width - 84,
        justifyContent: 'center',
    },
    addressStyle1: {
        borderBottomColor: colors.BLACK,
        borderBottomWidth: 1,
        height: 48,
        width: width - 84,
        justifyContent: 'center',
        paddingTop: 2
    },
    textStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        color: '#000'
    }, addressBar: {
        position: 'absolute',
        marginHorizontal: 20,
        top: Platform.OS == 'android' ? (__DEV__ ? 80 : 100) : (hasNotch ? 100 : 80),
        height: 100,
        width: width - 40,
        flexDirection: 'row',
        backgroundColor: colors.WHITE,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderRadius: 8,
        elevation: 3
    },
    ballandsquare: {
        width: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    hbox1: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: colors.GREEN_DOT
    },
    hbox2: {
        height: 36,
        width: 1,
        backgroundColor: colors.MAP_TEXT
    },
    hbox3: {
        height: 12,
        width: 12,
        backgroundColor: colors.DULL_RED
    },
    contentStyle: {
        justifyContent: 'center',
        width: width - 74,
        height: 100
    }, topTitle: {
        height: 50,
        width: 180,
        backgroundColor: colors.WHITE,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: Platform.OS == 'android' ? (__DEV__ ? 20 : 40) : (hasNotch ? 40 : 20)
    },
    topTitle1: {
        height: 50,
        width: 180,
        backgroundColor: colors.WHITE,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: Platform.OS == 'android' ? (__DEV__ ? 20 : 40) : (hasNotch ? 40 : 20)
    },
});

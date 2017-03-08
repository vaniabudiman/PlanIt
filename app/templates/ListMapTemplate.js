import React, { Component } from "react";
import { Dimensions } from "react-native";
import { ListViewStyles } from "../styles/ListViewStyles.js";
import MapView from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome";
import { ListView, Text, TextInput, Title, Subtitle, Divider, View, Row, Button, TouchableOpacity } from "@shoutem/ui";
import CalendarPicker from "react-native-calendar-picker";


/**
 * @typedef ListMapTemplate~ListObject
 * @desc An object representing an item in the list
 *
 * @property {number | string} id
 *    Unique id for this item.
 * @property {string} title
 *    Title of the list item.
 * @property {string} subtitle
 *    Subtitle for this list item.
 * @property {ListMapTemplate~MapItemObject} [mapDetails]
 *    Optional map item object that holds info for rendering item on the map.
 *          TODO: Currently nothing in the template makes us of this property.
 *                (i.e. no internal template functionality exists to support rendering items to the map using this prop)
 *                Instead, the "mapProps" property on the template itself is exposed for you to customize that
 *                props and data you want displayed on the map.
*/

/**
 * @typedef ListMapTemplate~MapObject
 * @desc An object of fields representing the properties to be set on the MapView component specifically.
 *
*/

/**
 * @typedef ListMapTemplate~MapItemObject
 * @desc An object holding the necessary fields for rendering a list item on the map.
 *    TODO: Below are possible properties (not sure what will actually be necessary though).
 *
 * @property {number} locationId
 *    Location id for this map item.
 * @property {number} lat
 *    Latitude for  this map item.
 * @property {number} lon
 *    Longitude for this map item.
*/

/**
 * @callback ListMapTemplate~onRefresh
 *
*/

/**
 * @callbaack ListMapTemplate~onLoadMore
 *
*/

/**
 * @callback ListMapTemplate~onCreateItem
 *
*/

/**
 * @callback ListMapTemplate~onClickItem
 *
 * @param {ListMapTemplate~ListObject} item
 *    The complete list item object.
*/

/**
 * @callback ListMapTemplate~onAdd
 *
 * @param {number} id
 *    Unique id for the item to be added.
*/

/**
 * @callback ListMapTemplate~onInfo
 *
 * @param {number} id
 *    Unique id for the item to get info on.
*/

/**
 * @callback ListMapTemplate~onShare
 *
 * @param {number} id
 *    Unique id for the item to be shared.
*/

/**
 * @callback ListMapTemplate~onToggleMap
 *
 * @param {boolean} showMap
 *    The state of the showMap hide/show after it has been toggled.
*/

/**
 * @callback ListMapTemplate~onSearch
 *
 * @param {string} searchString
 *    The string currently being used in the search.
*/

/**
 * @Class ListMapTemplate
 * @desc A basic list view type template for rendering views utilizing lists
 *
 * @property {Array<ListMapTemplate~ListObject>} data
 *    An array of data items representing the list.
 * @property {string} [emptyListMessage]
 *    The message to be displayed if there are no data items to be rendered.
 * @property {ListMapTemplate~onClickItem} [onClickItem]
 *    Callback to be triggered when a list item is clicked.
 * @property {ListMapTemplate~onCreateItem} [onCreateItem]
 *    Callback to be triggered when creating a new item.
 *
 * @property {boolean} [loadingData=false]
 *    whether the list view should render loading spinner (to indicate it’s still loading data)
 *    or the actual list items (when the data successfully loads)
 * @property {ListMapTemplate~onRefresh} [onRefresh]
 *    Callback to be triggered to fetch data to refresh the data list.
 * @property {ListMapTemplate~onLoadMore} [onLoadMore]
 *    Callback to be triggered to fetch more data to add to the data list.
 *
 * @property {boolean} [enableMap=false]
 *    Whether or not the map should be enabled.
 * @property {ListMapTemplate~MapObject} [mapProps]
 *    Object of properties to be added to the MapView specifically.
 *          TODO: not sure if the template should restrict the map Props allowed to be passed in or not.
 *                I think it'll be convenient for you guys to be able to pass w/e is necessary for the map
 *                based on the particular view you're implementing though. So leaving like this for now
 * @property {boolean} [showMap=false]
 *    Whether or not the map is displayed.
 * @property {ListMapTemplate~onToggleMap} [onToggleMap]
 *    Callback to be triggerred when the switch controlling the map show/hide is toggled.
 *
 * @property {boolean} [enableCalendar=false]
 *    Whether or not the calendar should be enabled.
 * @property {ListCalendarTemplate~CalendarObject} [calendarProps]
 *    Object of properties to be added to the CalendarView specifically.
 *          TODO: not sure if the template should restrict the calendar Props allowed to be passed in or not.
 *                I think it'll be convenient for you guys to be able to pass w/e is necessary for the calendar
 *                based on the particular view you're implementing though. So leaving like this for now
 * @property {boolean} [showCalendar=false]
 *    Whether or not the calendar is displayed.
 * @property {ListCalendarTemplate~onToggleCalendar} [onToggleCalendar]
 *    Callback to be triggerred when the switch controlling the calendar show/hide is toggled.
 *
 * @property {boolean} [enableSearch=false]
 *    Whether or not the search bar should be enabled.
 * @property {ListMapTemplate~onSearch} [onSearch]
 *    Callback to be triggerred when searching.
 *
 * @property {boolean} [showAdd=false]
 *    Whether or not the add icon is displayed for the list items.
 * @property {ListMapTemplate~onAdd} [onAdd]
 *    Callback to be triggered when the add icon is clicked.
 *
 * @property {boolean} [showInfo=false]
 *    Whether or not the info icon is displayed for the list items.
 * @property {ListMapTemplate~onInfo} [onInfo]
 *    Callback to be triggered when the info icon is clicked.
 *
 * @property {boolean} [showShare=false]
 *    Whether or not the share icon is displayed for the list items.
 * @property {ListMapTemplate~onShare} [onShare]
 *    Callback to be triggered when the info icon is clicked.
*/
export default class ListMapTemplate extends Component {

    static propTypes = {
        data: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
            title: React.PropTypes.string,
            subtitle: React.PropTypes.string
        })).isRequired,
        emptyListMessage: React.PropTypes.string,
        onRefresh: React.PropTypes.func,
        onLoadMore: React.PropTypes.func,
        enableMap: React.PropTypes.bool,
        enableCalendar: React.PropTypes.bool,
        mapProps: React.PropTypes.object,
        calendarProps: React.PropTypes.object,
        enableSearch: React.PropTypes.bool,
        showMap: React.PropTypes.bool,
        onToggleMap: React.PropTypes.func,
        showCalendar: React.PropTypes.bool,
        onToggleCalendar: React.PropTypes.func,
        onSearch: React.PropTypes.func,
        showAdd: React.PropTypes.bool,
        onAdd: React.PropTypes.func,
        showInfo: React.PropTypes.bool,
        onInfo: React.PropTypes.func,
        showShare: React.PropTypes.bool,
        onShare: React.PropTypes.func,
        loadingData: React.PropTypes.bool,
        onClickItem: React.PropTypes.func,
        onCreateItem: React.PropTypes.func
    }

    static defaultProps = {
        data: [],
        enableMap: false,
        enableCalendar: false,
        enableSearch: false,
        showMap: false,
        showCalendar: false,
        showAdd: false,
        showInfo: false,
        showShare: false,
        loadingData: false
    }

    constructor (props) {
        super(props);

        this.state = {
            showMap: this.props.showMap,
            showCalendar: this.props.showCalendar,
            date: new Date("April 1, 2017 00:00:00")
        };

        // Bind callback handlers
        this._handleInputValueChange = this._handleInputValueChange.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleToggleCalendar = this._handleToggleCalendar.bind(this);
        this._handleDateSelect = this._handleDateSelect.bind(this);
    }

    _handleInputValueChange (str) {
        this.props.onSearch(str);
    }

    _handleDateSelect (date) {
        this.setState({ date: date });
    }

    _handleToggleMap () {
        var newMapToggleState = !this.state.showMap;
        this.setState({ showMap: newMapToggleState }, () => this.props.onToggleMap(newMapToggleState));
    }

    _handleToggleCalendar () {
        var newCalendarToggleState = !this.state.showCalendar;
        this.setState({
            showCalendar: newCalendarToggleState }, () => this.props.onToggleCalendar(newCalendarToggleState)
        );
    }

    renderSearchBar () {
        if (this.props.enableSearch) {
            return (
                <View>
                    { /* TODO: fix alignment of search icon to the left of the search placeholder to match mocks */ }
                    {/*<View>
                        <Icon name="search" />
                    </View>*/}
                    <TextInput placeholder="Search..."
                        multiline={false}
                        maxLength={40}
                        onChangeText={this._handleInputValueChange} />
                </View>
            );
        }
    }

    renderMapToggle () {
        if (this.props.enableMap) {
            return (
                <TouchableOpacity onPress={this._handleToggleMap} style={{ height: 40 }}>
                    <View>
                        { /* TODO: fix alignment of label & toggle to match mocks */ }
                        <Text style={{ fontSize: 20 }}>Map</Text>
                        <Icon name={this.state.showMap ? "toggle-on" : "toggle-off" } size={20} />
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderMap () {
        if (this.props.enableMap && this.state.showMap) {
            return <MapView style={{ flex: 1 }} {...this.props.mapProps} />;
        }
    }

    renderCalendarToggle () {
        if (this.props.enableCalendar) {
            return (
                <TouchableOpacity onPress={this._handleToggleCalendar} style={{ height: 20 }}>
                    <View>
                        { /* TODO: fix alignment of label & toggle to match mocks */ }
                        <Text style={{ fontSize: 20 }}>
                            Calendar
                            <Icon name={this.state.showCalendar ? "toggle-on" : "toggle-off" } size={20} />
                        </Text>
                        
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderCalendar () {
        if (this.props.enableCalendar && this.state.showCalendar) {
            return (
                <View>
                    <CalendarPicker selectedDate={this.state.date}
                                    onDateChange={this._handleDateSelect}
                                    screenWidth={Dimensions.get("window").width}
                                    selectedBackgroundColor={"#5ce600"}
                                    scaleFactor={.9}
                                    minDate={new Date(this.props.calendarProps.startDate)}
                                    maxDate={new Date(this.props.calendarProps.endDate)} />
                </View>
            );
        }
    }

    renderCreateButton () {
        if (this.props.onCreateItem) {
            return (
                <Button onPress={this.props.onCreateItem}>
                    <Text>CREATE NEW</Text>
                </Button>
            );
        }
    }

    renderRowIcons (item) {
        let icons = [];

        if (this.props.showAdd) {
            icons.push(
                <TouchableOpacity key={"icon-add-" + item.id} onPress={this.props.onAdd.bind(null, item.id)}>
                    <Icon name="plus" style={ListViewStyles.optionIcons} size={16} />
                </TouchableOpacity>
            );
        }
        if (this.props.showInfo) {
            icons.push(
                <TouchableOpacity key={"icon-info-" + item.id} onPress={this.props.onInfo.bind(null, item.id)}>
                    <Icon name="info-circle" style={ListViewStyles.optionIcons} size={16} />
                </TouchableOpacity>
            );
        }
        if (this.props.showShare) {
            icons.push(
                <TouchableOpacity key={"icon-share-" + item.id} onPress={this.props.onShare.bind(null, item.id)}>
                    <Icon name="share-alt" style={ListViewStyles.optionIcons} size={16} />
                </TouchableOpacity>
            );
        }

        return <View styleName="horizontal">{icons}</View>;
    }

    renderRow (item) {
        return (
            <View>
                <TouchableOpacity onPress={this.props.onClickItem.bind(null, item)}>
                    <Row>
                        <View styleName="horizontal space-between">
                            <View styleName="vertical">
                                <Title>{item.title}</Title>
                                <Subtitle>{item.subtitle}</Subtitle>
                            </View>
                            {this.renderRowIcons(item)}
                        </View>
                    </Row>
                </TouchableOpacity>
                <Divider styleName="line" />
            </View>
        );
    }

    render () {
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                {this.renderMapToggle()}
                {this.renderMap()}
                {this.renderCalendarToggle()}
                {this.renderCalendar()}
                {this.renderSearchBar()}
                {
                    this.props.data.length === 0
                        ? <Text style={{ alignSelf: "center", paddingTop: 50 }}>{this.props.emptyListMessage}</Text>
                        : null
                }
                <ListView
                    style={{ flex: 2 }}
                    data={this.props.data}
                    renderRow={item => this.renderRow(item)}
                    onRefresh={this.props.onRefresh}
                    loading={this.props.loadingData}
                />
                {this.renderCreateButton()}
            </View>
        );
    }

}
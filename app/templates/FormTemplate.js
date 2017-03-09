/*eslint-disable valid-jsdoc*/

import React, { Component } from "react";
import MapView from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    View,
    Text,
    TextInput,
    ListView,
    Button,
    Subtitle,
    Divider,
    Row,
    TouchableOpacity } from "@shoutem/ui";
import { DatePickerAndroid } from "react-native";


/**
 * @typedef FormTemplate~InputObject.Types
 * @desc Types that an input field can take. Currently only supports text.
 *
 * @property {string} TEXT
*/
export const Types = {
    TEXT: "text",
    DATE: "date"
};

/**
 * @typedef FormTemplate~InputObject
 * @desc An object representing the details for a specific input.
 *
 * @property {number} id
 *    Unique id for this input.
 * @property {string} title
 *    Title of the input item.
 * @property {string} placeholder
 *    Placeholder for this input item.
 * @property {string} value
 *    Value for this input item.
 * @property {boolean} [readonly=false]
 *    Whether or not this input field is readonly.
 * @property {string} [type=FormTemplate~InputObject.Types.TEXT]
 *    The type of this field value.
 *          TODO: Currently, only has one text type. May be expanded to support more in future
 *                (e.g. images, etc.) by adding associatedtype & fields to the InputObject.
 * @property {FormTemplate~MapItemObject} [mapDetails]
 *    Optional map item object that holds info for rendering item on the map.
 *          TODO: Currently nothing in the template makes us of this property.
 *                (i.e. no internal template functionality exists to support rendering items to the map using this prop)
 *                Instead, the "mapProps" property on the template itself is exposed for you to customize that
 *                props and data you want displayed on the map.
*/

/**
 * @typedef FormTemplate~MapObject
 * @desc An object of fields representing the properties to be set on the MapView component specifically.
 *
*/

/**
 * @typedef FormTemplate~MapItemObject
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
 * @callback FormTemplate~onInputValueChange
 *
 * @param {number} id
 *    Unique id of the input field that changed value.
*/

/**
 * @callback FormTemplate~onRefresh
 *
*/

/**
 * @callbaack FormTemplate~onLoadMore
 *
*/

/**
 * @callback FormTemplate~onCancel
 *
*/

/**
 * @callback FormTemplate~onSave
 *
*/

/**
 * @callback FormTemplate~onToggleMap
 *
 * @param {boolean} showMap
 *    The state of the showMap hide/show after it has been toggled.
*/

/**
 * @Class FormTemplate
 * @desc A basic item/details view type template for rendering views to display a set of fields.
 *
 * @property {Array<FormTemplate~InputObject>} data
 *    An array of data items representing the list of field details.
 * @property {FormTemplate~onInputValueChange} onInputValueChange
 *    Callback to be triggered when an input fields changes its value.
 *
 * @property {boolean} [loadingData=false]
 *    Whether the list view should render loading spinner (to indicate it’s still loading data)
 *    or the actual list items (when the data successfully loads)
 * @property {FormTemplate~onRefresh} [onRefresh]
 *    Callback to be triggered to fetch data to refresh the data list.
 * @property {FormTemplate~onLoadMore} [onLoadMore]
 *    Callback to be triggered to fetch more data to add to the data list.
 *
 * @property {boolean} [enableMap=false]
 *    Whether or not the map should be enabled.
 * @property {FormTemplate~MapObject} [mapProps]
 *    Object of properties to be added to the MapView specifically.
 *          TODO: not sure if the template should restrict the map Props allowed to be passed in or not.
 *                I think it'll be convenient for you guys to be able to pass w/e is necessary for the map
 *                based on the particular view you're implementing though. So leaving like this for now
 * @property {boolean} [showMap=false]
 *    Whether or not the map is displayed.
 * @property {FormTemplate~onToggleMap} [onToggleMap]
 *    Callback to be triggerred when the switch controlling the map show/hide is toggled.
 *
 * @property {boolean} [showCancel=true]
 *    Whether or not the cancel button is displayed for the form.
 * @property {FormTemplate~onCancel} [onCancel]
 *    Callback to be triggered when the cancel button is clicked.
 *
 * @property {boolean} [showSave=true]
 *    Whether or not the save button is displayed for the form.
 * @property {FormTemplate~onSave} [onSave]
 *    Callback to be triggered when the save button is clicked.
 */
export default class FormTemplate extends Component {

    static propTypes = {
        data: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.number,
            title: React.PropTypes.string,
            placeholder: React.PropTypes.string,
            value: React.PropTypes.string,
            type: React.PropTypes.oneOf([Types.TEXT, Types.DATE])
        })).isRequired,
        onInputValueChange: React.PropTypes.func.isRequired,
        onRefresh: React.PropTypes.func,
        onLoadMore: React.PropTypes.func,
        enableMap: React.PropTypes.bool,
        mapProps: React.PropTypes.object,
        showMap: React.PropTypes.bool,
        onToggleMap: React.PropTypes.func,
        showCancel: React.PropTypes.bool,
        onCancel: React.PropTypes.func,
        showSave: React.PropTypes.bool,
        onSave: React.PropTypes.func,
        loadingData: React.PropTypes.bool,
        onDateSelect: React.PropTypes.func,
        isUpdate: React.PropTypes.bool
    }

    static defaultProps = {
        data: [],
        enableMap: false,
        showMap: false,
        showCancel: true,
        showSave: true,
        loadingData: false
    }

    constructor (props) {
        super(props);

        this.state = {
            showMap: this.props.showMap,
        };

        // Bind callback handlers
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._showPicker = this._showPicker.bind(this);
    }

    _handleToggleMap () {
        var newMapToggleState = !this.state.showMap;
        this.setState({ showMap: newMapToggleState }, () => this.props.onToggleMap(newMapToggleState));
    }

    _showPicker = async (itemId, options) => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open(options);
            if (action !== DatePickerAndroid.dismissedAction) {
                var date = new Date(year, month, day);
                this.props.onDateSelect(itemId, date.toDateString());
            }
        } catch ({ code, message }) {
            // TODO: implement catch block
        }
    }

    renderMapToggle () {
        if (this.props.enableMap) {
            return (
                <TouchableOpacity onPress={this._handleToggleMap} style={{ height: 20 }}>
                    <View>
                        { /* TODO: fix alignment of label & toggle to match mocks */ }
                        <Text style={{ fontSize: 20 }}>
                            Map
                            <Icon name={this.state.showMap ? "toggle-on" : "toggle-off" } size={20} />
                        </Text>
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

    renderRow (item) {
        var content;

        switch (item.type) {
            // TODO: other types (as necessary in future)
            case "date": {
                let value = (item.value === "") ? "Pick a Date" : item.value;
                content = (
                    <View>
                        <Subtitle>{item.title}</Subtitle>
                        <TouchableOpacity
                            onPress={() => this._showPicker(item.id, { date: new Date() })}>
                            <Text>{value}</Text>
                        </TouchableOpacity>
                        <Divider styleName="line" />
                    </View>
                );
                break;
            }
            default: {
                content = (
                    <View>
                        <Subtitle>{item.title}</Subtitle>
                        <TextInput placeholder={item.placeholder}
                            value={item.value}
                            multiline={false}
                            maxLength={40}
                            editable={!item.readOnly}
                            onChangeText={this.props.onInputValueChange.bind(null, item.id)} />
                        <Divider styleName="line" />
                    </View>
                );
                break;
            }
        }

        return <Row>{content}</Row>;
    }

    renderButtons () {
        let buttons = [];

        if (this.props.showCancel) {
            buttons.push(
                <Button key="button-cancel" styleName="full-width muted" onPress={this.props.onCancel}>
                    <Text>CANCEL</Text>
                </Button>
            );
        }
        if (this.props.showSave) {
            buttons.push(
                <Button key="button-delete" styleName="full-width muted" onPress={this.props.onSave}>
                    <Text>SAVE</Text>
                </Button>
            );
        }

        return <View styleName="horizontal" style={{ height: 50 }}>{buttons}</View>;
    }

    render () {
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                {this.renderMapToggle()}
                {this.renderMap()}
                <ListView
                    style={{ flex: 2 }}
                    data={this.props.data}
                    renderRow={item => this.renderRow(item)}
                    onRefresh={this.props.onRefresh}
                    loading={this.props.loadingData}
                />
                {this.renderButtons()}
            </View>
        );
    }

}
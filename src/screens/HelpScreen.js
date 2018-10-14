import React from 'react';
import {
    View, Text, TouchableHighlight,
    ScrollView,
    StyleSheet, Platform, Dimensions
} from 'react-native';

import LinkableMenuScreen from './LinkableMenuScreen';
import MarkdownProse from "../components/MarkdownProse";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Icon from "react-native-vector-icons/MaterialIcons";
import {defaultNavButtons} from "./BaseSideMenu";


// ===================================================================================================
// === tabbed help page holder
// ===================================================================================================

const routeMap = [
    { key: 'intro', title: 'Intro', fullTitle: 'Introduction' },
    { key: 'search', title: 'Search', fullTitle: 'Searching for Variants' },
    { key: 'follow', title: 'Follow', fullTitle: 'Following Variants' },
    { key: 'info', title: 'Info', fullTitle: 'Additional Information' },
];

export default class HelpScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: routeMap,
        };
    }

    static navigatorButtons = defaultNavButtons;

    static navigatorStyle = {
        drawUnderTabBar: true
    };

    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={SceneMap({
                    intro: IntroRoute,
                    search: SearchRoute,
                    follow: FollowRoute,
                    info: InfoRoute
                })}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width, height: 0 }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        renderLabel={({route, index}) => (
                            <Text style={{fontSize: 14, padding: 5, color: 'black'}}>{route.title}</Text>
                        )}
                        style={{backgroundColor: 'white', color: 'black'}}
                        tabStyle={{color: 'black'}}
                        indicatorStyle={{ backgroundColor: '#2b99ff', height: 3 }}
                    />
                }
            />
        );
    }
}

class HelpPage extends React.Component {
    render() {
        console.log(this.props);

        const myIndex = routeMap.findIndex(x => x.key === this.props.route.key);
        const prevItem = myIndex > 0 ? routeMap[myIndex-1] : null;
        const nextItem = myIndex < routeMap.length-1 ? routeMap[myIndex+1] : null;

        return (
            <ScrollView style={styles.container}>
                {
                    prevItem && (
                        <View style={{margin: 20, marginBottom: 0, marginLeft: 10, justifyContent: 'flex-start', flexDirection: "row", flex: 1}}>
                            <TouchableHighlight underlayColor={'white'}
                                onPress={() => this.props.jumpTo(prevItem.key)}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Icon name="keyboard-arrow-left" size={26} color={"#2b99ff"} />
                                    <Text style={{fontSize: 18, color: "#2b99ff"}}>{`Back to ${prevItem.fullTitle}`}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    )
                }

                <View style={{margin: 20, marginBottom: 10}}>
                    <MarkdownProse>
                    {this.props.children}
                    </MarkdownProse>
                </View>

                {
                    nextItem && (
                        <View style={{margin: 20, marginTop: 0, marginBottom: 40, justifyContent: 'flex-end', flexDirection: "row", flex: 1}}>
                            <TouchableHighlight underlayColor={'white'}
                                onPress={() => this.props.jumpTo(nextItem.key)}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={{fontSize: 18, color: "#2b99ff"}}>{nextItem.fullTitle}</Text>
                                    <Icon name="keyboard-arrow-right" size={26} color={"#2b99ff"} />
                                </View>
                            </TouchableHighlight>
                        </View>
                    )
                }
            </ScrollView>
        );
    }
}


// ===================================================================================================
// === help page definitions
// ===================================================================================================

const IntroRoute = (props) => (
    <HelpPage route={props.route} jumpTo={props.jumpTo}>
{`
# How to Use This App

The BRCA Exchange app is a mobile interface to the BRCA Exchange, a data portal for BRCA1 and BRCA2 genetic variants. You can use this app to browse information on [brcaexchange.org](http://brcaexchange.org), and to follow variants in which you are interested. Following a variant means that you will be notified when experts have decided to update the variant’s clinical significance.

The BRCA Exchange app has two main features:

1.  Searching for and viewing variant information
2.  Following variants for notifications about changes in expert opinions

## Navigating Within the App

The navigation sidebar allows you to access different parts of the app. Press the menu icon (☰) in the top-left corner of the screen to toggle the display of the sidebar. Show the sidebar by swiping from the left-hand side of the screen, and swipe in the opposite direction to hide it.

The following sections will provide more information on each item in the sidebar. “Home” and “Search Variants” features allow you to look for variants of interest in the app(see “Searching for Variants”). “Followed Variants” and “Notify Log” allow you to manage your followed variants and their notifications (see “Following Variant Changes”).
`}
    </HelpPage>
);

const SearchRoute = (props) => (
    <HelpPage route={props.route} jumpTo={props.jumpTo}>
{`
# Search for and View Variants

Search for a variant by using the search box on the Home screen or on the Search Variants screen.

The name of your variant may be located on a Genetic Test report. You can use a variety of variant names to search; you can also search the database for all variants that fit a certain criteria. Search criteria can include its standard name(s) including HGVS Nucleotide (which is used in this app as an informal identifier for each variant), clinical significance (e.g., “Pathogenic” or “Benign”), or genomic coordinates. For more information, please visit [brcaexchange.org](http://brcaexchange.org/help).

## Review Search Results

Once you have submitted a search term, results are displayed in a table below the search box. The list displays the gene on which the variant is located (“BRCA1” or “BRCA2”), the standard name for that variant (HGVS), and two columns of icons. The first column indicates the clinical significance of the variant, i.e. whether it is currently known to be pathogenic, benign, or of unknown significance. The second column indicates whether you are following the variant, which will be explained in “Following Variant Changes”. You can view the full set of icons by tapping the “Legend” button underneath the search bar.

If there are too many results to display on one page, you will need to scroll to see the whole list.. As you scroll, a button will appear in the bottom-right corner which will bring you back to the top of the list when tapped.

Tapping an individual variant in the list will take you to the “Variant Details” screen for that variant.

## View Variant Details

The variant details page displays more in-depth information about the selected variant. The header consists of the standard name (HGVS) for the variant and a button in the top-right corner that links to that variant’s information on [brcaexchange.org](http://brcaexchange.org). There is also a “follow” toggle button below the title whose functionality will be explained in the next section.

The remainder of the page has two sections. The first is a general list of information about the variant, which includes additional identifiers for the variant and comments on its significance. The second is a “version history” section at the end of the screen, which chronicles when the variant was introduced into the database and its clinical significance with each database update.
`}
    </HelpPage>
);


const FollowRoute = (props) => (
    <HelpPage route={props.route} jumpTo={props.jumpTo}>
{`
# Follow Variants & Receive Notifications

Following a variant allows you to 1) keep a list of variants in which you’re interested, and 2) receive updates as push notifications when the variant’s clinical significance changes. You can follow a variant by tapping the “follow” button on the Variant Details page; once tapped, it will toggle into a green button labeled “following variant”. You may tap it again to unfollow the variant.

Once a variant has been followed, it will appear with a black bookmark icon in the results list on the “Search Variants” page.

## View Followed Variants

Review the list of variants you are following by tapping “Followed Variants” in the navigation sidebar. The “Following” screen shows a list of variants you are following, referenced by their standard name (HGVS cDNA). Tapping the text will take you to the details for that variant. You may also unfollow a variant from this screen by tapping the “following” button in the list. Note that your changes will be committed when you navigate away from this page, allowing you re-follow a variant if you unfollow it accidentally.

## When and Why Do Variants Change?

The BRCA Exchange updates its approximately every month, which includes integrating newly available clinical evidence for variants. This may cause their clinical significance to change, e.g. a variant of unknown significance may be declared pathogenic or benign.

If you are following a variant whose clinical significance changes, you will receive a notification on your phone; you can tap the notification to view the update. If you are following multiple variants that change in a given update, you will receive a single “batch” notification that specifies how many variants have changed. In that case, tapping the notification will take you to the “Notify Log” page, described in the following section.

## Check For and View Variant Updates

In addition to receiving notifications, you may use the “Notify Log”, accessible from the navigation sidebar, to check which variants have changed significance since you followed them. The “Notify Log” is effectively a history of the push notifications you have received. If you are subscribed to multiple variants, you will see each variant that has changed in that database update grouped together.

If you want to check manually for updates, you may pull down on the list to refresh This will cause the app check for the latest updates; if there are any updates, the list will change to show them.

Each element in the Notify Log consists of a title, a synopsis of the change, and the date and time at which the notification was received. Additionally, each updated entry shows a small colored circle,indicating whether you have viewed the details page for that variant. The indicator will appear blue if the notification is unread, and will turn gray once you visit the variant details page for an updated variant. Visit the variant details page by tapping the entry.

If you wish to clear all the indicators at once, you may use the “Mark as Read” button to do so. If you want to declutter the list, you may remove all the entries from the list by pressing the “Archive” button. The app will remember the last version you archived, so if you manually refresh the list it will only display updates after that point.

## Where Is My List of Followed Variants Stored?

For privacy purposes, the variants that you are following are stored locally on your phone. When the app queries for updates, it receives a full list of changed variants and then locally filters it down to your followed variants to determine which updates to show you. In summary, the list of followed variants is never transmitted from your phone. In the event that you delete the app or get a new phone, you will need to re-follow your variant(s) of interest.
`}
    </HelpPage>
);

const InfoRoute = (props) => (
    <HelpPage route={props.route} jumpTo={props.jumpTo}>
{`
# Additional Information

The remaining entries in the navigation sidebar are “About This App” and “User Guide”. “About This App” contains some informational text about the app, a link to the full website, [brcaexchange.org](http://brcaexchange.org), and a short list of attributions to the various organizations that have contributed data and development effort to the project.

The second item, “User Guide”, is the page you are currently reading.

If you have any further questions, please feel free to contact us: [brca-exchange-contact@genomicsandhealth.org](mailto:brca-exchange-contact@genomicsandhealth.org).
`}
    </HelpPage>
);

// ===================================================================================================
// === page styles
// ===================================================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
        padding: 20,
        paddingBottom: 0
    },
    prose: {
        lineHeight: 18,
        paddingLeft: 20,
        paddingRight: 20
    },
    markdown: {
        margin: 20,
        padding: 20,
        flex: 0.8
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    },
    logo: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center'
    },
    tokenText: {
        fontSize: 10,
        color: '#eee'
    }
});

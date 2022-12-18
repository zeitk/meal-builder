import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Meals from "../components/Meals";
import Home from '../components/Home';
import Search from "../components/Search";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { QuicklistContext } from "../context/QuicklistContext";

const TabNavigator = createBottomTabNavigator();

export default function Tabs() {
    
    // TODO add login capabilities 

    return<>

        <TabNavigator.Navigator>
            <TabNavigator.Screen name="Home" component={Home} options={{headerShown: true, tabBarIcon() {
                return<>
                    <Feather
                        name="home"
                        size={20}
                        color="black">
                    </Feather></>
                },}}></TabNavigator.Screen>

            <TabNavigator.Screen name="Search" component={Search} options={{headerShown: true, tabBarIcon() {
                return<>
                    <Feather
                        name="search"
                        size={20}
                        color="black">
                    </Feather></>
                },}}></TabNavigator.Screen>
            
            <TabNavigator.Screen name="Meals" component={Meals} options={{headerShown: true, tabBarIcon() {
                return<>
                    <MaterialCommunityIcons
                        name="silverware"
                        size={20}
                        color="black">
                    </MaterialCommunityIcons></>
                },}}></TabNavigator.Screen>
        </TabNavigator.Navigator>

    </>
}
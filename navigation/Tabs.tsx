import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Meals from "../components/Meals";
import Home from '../components/Home';
import Search from "../components/Search";


const TabNavigator = createBottomTabNavigator();

export default function Tabs() {
    
    // TODO add login capabilities 

    return<>
        <TabNavigator.Navigator>
            <TabNavigator.Screen name="Home" component={Home} options={{headerShown: true}}></TabNavigator.Screen>
            <TabNavigator.Screen name="Search" component={Search}></TabNavigator.Screen>
            <TabNavigator.Screen name="Meals" component={Meals}></TabNavigator.Screen>
        </TabNavigator.Navigator>
    </>
}
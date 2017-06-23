import { TabsPage } from './tabs/tabs';
import { SplashPage } from './splash/splash';
import { SettingsPage } from './settings/settings';
import { HomePage } from './home/home';
import { FavoritePage } from './favorite/favorite';
import { StatisticPage } from './statistic/statistic';
import { NaviroutePage }  from './naviroute/naviroute';
// The page the user lands on after opening the app and without a session
export const FirstRunPage = SplashPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = StatisticPage;
export const Tab2Root = HomePage;
export const Tab3Root = HomePage;
export const Tab4Root = NaviroutePage;
export const Tab5Root = FavoritePage;

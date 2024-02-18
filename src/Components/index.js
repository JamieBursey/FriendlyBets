import Banner from "./Banner";
import Table from "./Table";

import Buttons from "./Buttons";
import { Matches, NflMatches } from "./Matches";
import NavBar from "./NavBar";
import { acceptBets, deleteBets } from "./HandleBets";
import { SportsDiv } from "./divColors";
// import { TodaysGames, liveGames } from "./TodaysGames";
import { CheckBetResults } from "./CheckBets";
import { bannerTextStyles } from "./Banner";
import { NflTodaySchedule, NflWeeklySchedule } from "./nfl.js/NflSchedule";
import {
  AvatarComponent,
  DisplayName,
  MyAccEmail,
  MyAccountChanges,
  AboutMeComponent,
  RenderAboutMe,
  NavigateToUpdate,
  RenderFavoriteTeam,
  UpdateFavTeam,
} from "./MyAccData";
import {
  RenderContact,
  AdminMessages,
  backgroundGradient,
} from "./ContactComponent";
import { FriendRequests } from "./NotificationComp";

export {
  Banner,
  Table,
  Buttons,
  Matches,
  SportsDiv,
  NavBar,
  // TodaysGames,
  acceptBets,
  CheckBetResults,
  deleteBets,
  AvatarComponent,
  DisplayName,
  MyAccEmail,
  MyAccountChanges,
  AboutMeComponent,
  RenderAboutMe,
  NavigateToUpdate,
  RenderFavoriteTeam,
  UpdateFavTeam,
  RenderContact,
  FriendRequests,
  NflTodaySchedule,
  NflWeeklySchedule,
  NflMatches,
  bannerTextStyles,
  backgroundGradient,
  // liveGames,
};

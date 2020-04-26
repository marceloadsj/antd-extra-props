import injectOnCard from "./components/Card";

export default ({ Card } = {}) => {
  if (Card) injectOnCard(Card);
};

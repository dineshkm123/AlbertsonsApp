import { Appbar } from "react-native-paper";

export default function Header({ title }) {
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

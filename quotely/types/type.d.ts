type CustomButtonProps = {
  title: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

type Note = {
  id: string;
  content: string;
  date: string;
  bgColor: string;
};

type HeaderProps = {
  title: string;
  elements?: React.ReactNode;
};

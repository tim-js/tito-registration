import { Text, ActivityIndicator } from 'react-native';

const Loader = ({ text = 'Please wait...' }) => {
  return (
    <>
      <ActivityIndicator />
      <Text>{text}</Text>
    </>
  );
};

export default Loader;

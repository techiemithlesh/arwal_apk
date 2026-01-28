import React, { useRef, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const LoginForm = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });

  const validateInputs = () => {
    const newError = { email: '', password: '' };

    if (!email) {
      newError.email = 'Email is required';
      emailRef.current.focus(); // focus email if empty
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newError.email = 'Enter a valid email';
      emailRef.current.focus(); // focus email if invalid
    } else if (!password) {
      newError.password = 'Password is required';
      passwordRef.current.focus(); // focus password if empty
    } else if (password.length < 6) {
      newError.password = 'Password must be at least 6 characters';
      passwordRef.current.focus(); // focus password if too short
    }

    setError(newError);

    if (!newError.email && !newError.password) {
      console.log('Email:', email);
      console.log('Password:', password);
      emailRef.current.blur();
      passwordRef.current.blur();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={emailRef}
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error.email ? <Text style={styles.error}>{error.email}</Text> : null}

      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error.password ? (
        <Text style={styles.error}>{error.password}</Text>
      ) : null}

      <Button title="Login" onPress={validateInputs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
  },
  error: { color: 'red', marginBottom: 10 },
});

export default LoginForm;

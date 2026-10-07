import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// 🔥 SUPABASE JÁ CONECTADO - TUA URL REAL!
const supabaseUrl = 'https://beghuthnyxhpfvczkyjs.supabase.co';
const supabaseKey = 'sb_publishable_UHi-wa2MwlaDrGEOTBdpUQ_XWEic9Rw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [tela, setTela] = useState('login'); // login, verificar, home
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [pais, setPais] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // CRIAR CONTA
  const criarConta = async () => {
    if (!nome || !idade || !pais || !email || !senha) {
      Alert.alert('Erro', 'Preenche tudo CEO!');
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
      });
      if (error) throw error;
      
      // Salva perfil
      const userId = data.user?.id;
      if (userId) {
        await supabase.from('perfis').insert([
          { id: userId, nome, idade: parseInt(idade), pais, email }
        ]);
      }
      Alert.alert('Sucesso!', 'Conta criada! Verifica teu email');
      setTela('verificar');
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  // LOGIN
  const fazerLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      setTela('home');
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  if (tela === 'verificar') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>AfroTalk ✉️</Text>
        <Text style={styles.texto}>Verifica teu email CEO!</Text>
        <Text style={styles.texto}>Mandamos link pra: {email}</Text>
        <TouchableOpacity style={styles.botao} onPress={() => setTela('login')}>
          <Text style={styles.botaoTexto}>Voltar pro Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (tela === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>AfroTalk 🌍🔥</Text>
        <Text style={styles.texto}>BEM-VINDO CEO {nome}!</Text>
        <Text style={styles.texto}>AfroTalk ONLINE e conectado no Supabase!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>AfroTalk 🌍</Text>
      <Text style={styles.sub}>Conexão África Diáspora</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Idade" keyboardType="numeric" value={idade} onChangeText={setIdade} />
      <TextInput style={styles.input} placeholder="País" value={pais} onChangeText={setPais} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

      <TouchableOpacity style={styles.botao} onPress={criarConta}>
        <Text style={styles.botaoTexto}>Criar Conta AfroTalk</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, {backgroundColor: '#333'}]} onPress={fazerLogin}>
        <Text style={styles.botaoTexto}>Já tenho conta - Entrar</Text>
      </TouchableOpacity>
      
      <Text style={{marginTop:20, color:'green'}}>✅ Supabase Conectado: beghuthnyx...</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  sub: { textAlign: 'center', marginBottom: 20, color: '#666' },
  texto: { textAlign: 'center', fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 12 },
  botao: { backgroundColor: '#000', padding: 15, borderRadius: 10, marginTop: 10 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

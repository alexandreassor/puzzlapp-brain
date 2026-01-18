/**
 * Test standalone de l'agent Victor
 *
 * Exécuter avec : npm run test:victor
 */

import { runVictor, runVictorStream, VICTOR_CONFIG } from './index.js';

async function testVictor() {
  console.log('🤖 Test de l\'agent Victor');
  console.log('=' .repeat(50));
  console.log(`Agent: ${VICTOR_CONFIG.name}`);
  console.log(`Skills: ${VICTOR_CONFIG.skills.join(', ')}`);
  console.log('=' .repeat(50));

  const context = {
    userId: 'test-user',
    sectionTitle: 'Le modèle SECI de Nonaka & Takeuchi',
    chapterTitle: 'Fondements théoriques du Knowledge Management',
  };

  // Test 1: Compétence Rédaction
  console.log('\n📝 Test 1: Compétence RÉDACTION');
  console.log('-'.repeat(40));

  const result1 = await runVictor(
    'redaction',
    'Rédige une introduction de 2 paragraphes sur le modèle SECI, en expliquant les 4 phases de conversion des connaissances.',
    context
  );

  if (result1.success) {
    console.log('✅ Réponse reçue:');
    console.log(result1.message.substring(0, 500) + '...');
    console.log(`\nTokens: ${result1.usage?.inputTokens} in / ${result1.usage?.outputTokens} out`);
  } else {
    console.log('❌ Erreur:', result1.error);
  }

  // Test 2: Compétence Recherche (streaming)
  console.log('\n\n🔍 Test 2: Compétence RECHERCHE (streaming)');
  console.log('-'.repeat(40));

  let streamedContent = '';
  for await (const event of runVictorStream(
    'recherche',
    'Trouve des études récentes (2020-2025) sur le Knowledge Management en cabinet comptable.',
    context
  )) {
    if (event.type === 'text') {
      streamedContent += event.content;
      process.stdout.write(event.content || '');
    } else if (event.type === 'tool_use') {
      console.log(`\n🔧 Outil: ${event.toolCall?.name}`);
    } else if (event.type === 'done') {
      console.log('\n✅ Streaming terminé');
    } else if (event.type === 'error') {
      console.log(`\n❌ Erreur: ${event.error}`);
    }
  }

  // Test 3: Compétence Critique
  console.log('\n\n📊 Test 3: Compétence CRITIQUE');
  console.log('-'.repeat(40));

  const sampleText = `
Le Knowledge Management est important pour les cabinets comptables.
Il permet de capitaliser les connaissances et d'améliorer la performance.
Les collaborateurs peuvent partager leur savoir.
  `;

  const result3 = await runVictor(
    'critique',
    `Analyse ce texte et donne-moi une évaluation critique:\n\n${sampleText}`,
    context
  );

  if (result3.success) {
    console.log('✅ Analyse critique:');
    console.log(result3.message);
  } else {
    console.log('❌ Erreur:', result3.error);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Tests terminés');
}

// Exécuter les tests
testVictor().catch(console.error);

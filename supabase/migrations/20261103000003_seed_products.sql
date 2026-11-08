-- Catálogo inicial da loja PetApoio: lembranças e homenagens feitas sob encomenda.
-- As imagens em /produtos/* são ilustrações de referência; substitua por fotos reais no painel admin.

insert into public.products
  (slug, name, category, summary, description, price_cents, production_days, needs_photo, needs_name, images, sort_order)
values
  ('retrato-ilustrado', 'Retrato ilustrado do seu pet', 'memorias',
   'Uma ilustração feita à mão a partir da foto que você escolher, emoldurada em madeira.',
   E'Você envia uma foto em que reconhece o jeito do seu companheiro, e uma ilustradora transforma essa imagem em um retrato delicado, em tons suaves.\n\nAntes de produzir, enviamos uma prévia por e-mail para você aprovar. Se algo não parecer com ele, ajustamos.\n\nTamanho: 30 × 40 cm, com moldura de madeira clara e paspatur.',
   18900, 12, true, false, '{/produtos/retrato-ilustrado-1.webp,/produtos/retrato-ilustrado-2.webp}', 10),

  ('quadro-foto-nome', 'Quadro com foto e nome', 'memorias',
   'Sua foto preferida, com o nome e os anos que vocês passaram juntos.',
   E'Um quadro simples para um lugar especial da casa. Imprimimos a foto em papel fotográfico fosco e gravamos o nome e as datas logo abaixo.\n\nSe preferir, deixe as datas em branco: só o nome já basta.\n\nTamanho: 21 × 30 cm, moldura grafite.',
   12900, 7, true, true, '{/produtos/quadro-foto-nome-1.webp}', 20),

  ('caixa-recordacoes', 'Caixa de recordações em madeira', 'memorias',
   'Um lugar para guardar a coleira, o brinquedo preferido e as pequenas lembranças.',
   E'Feita em madeira de reflorestamento, com o nome gravado na tampa e uma frase curta, se você quiser.\n\nMuitas pessoas não sabem o que fazer com os objetos do pet. Guardá-los com cuidado pode ser uma forma de manter essa história por perto, no seu tempo.\n\nMedidas internas: 28 × 20 × 12 cm.',
   16900, 10, false, true, '{/produtos/caixa-recordacoes-1.webp,/produtos/caixa-recordacoes-2.webp}', 30),

  ('livro-de-memorias', 'Livro de memórias com fotos', 'memorias',
   'Um livro de capa dura com as fotos e histórias de vocês, montado com você.',
   E'Você envia uma foto agora e, depois da compra, combinamos por e-mail as outras imagens e os pequenos textos que quiser incluir.\n\nNão há pressa: o livro só entra em produção quando você aprovar a prévia.\n\n24 páginas, capa dura em tecido, 21 × 21 cm.',
   23900, 15, true, false, '{/produtos/livro-memorias-1.webp,/produtos/livro-memorias-2.webp}', 40),

  ('pingente-gravado', 'Pingente com nome gravado', 'lembrancas',
   'Um pingente em prata 925 para levar o nome dele sempre com você.',
   E'Pingente redondo de 2 cm em prata 925, com corrente de 45 cm. Gravamos o nome à mão, em letra cursiva, e um pequeno coração.\n\nAcompanha uma bolsinha de algodão para guardar.',
   14900, 7, false, true, '{/produtos/pingente-gravado-1.webp}', 50),

  ('placa-memorial-jardim', 'Placa memorial para jardim', 'lembrancas',
   'Uma placa em cerâmica resistente ao tempo, para o jardim ou para um vaso.',
   E'Para quem gosta de ter um cantinho de lembrança ao ar livre. A placa é feita em cerâmica esmaltada, resistente ao sol e à chuva, com o nome e uma frase curta gravados.\n\nTamanho: 20 × 14 cm, com haste para fixar na terra.',
   11900, 10, false, true, '{/produtos/placa-jardim-1.webp}', 60),

  ('porta-retrato-madeira', 'Porta-retrato de madeira', 'lembrancas',
   'Um porta-retrato simples, de madeira maciça, para a foto que você quiser.',
   E'Feito em madeira maciça com acabamento natural, para fotos de 10 × 15 cm. Pode ficar em pé na mesa ou pendurado na parede.\n\nSe quiser que a gente imprima a foto, responda o e-mail de confirmação do pedido com a imagem.',
   6900, 5, false, false, '{/produtos/porta-retrato-1.webp}', 70),

  ('caderno-de-memorias', 'Caderno de memórias', 'acolhimento',
   'Um caderno com perguntas delicadas para escrever sobre ele, no seu ritmo.',
   E'Escrever pode ajudar a organizar o que se sente. Este caderno traz algumas perguntas gentis, como "do que eu mais sinto falta" ou "um dia que quero lembrar", e muitas páginas livres.\n\nFoi pensado com orientação de uma psicóloga e não substitui acompanhamento profissional.\n\nCapa em tecido de linho com o nome gravado, 120 páginas, 15 × 21 cm.',
   7900, 5, false, true, '{/produtos/caderno-memorias-1.webp,/produtos/caderno-memorias-2.webp}', 80),

  ('cartoes-de-acolhimento', 'Cartões de acolhimento', 'presentes',
   'Três cartões com mensagens cuidadosas para quem perdeu um pet.',
   E'Às vezes é difícil encontrar as palavras. Os cartões trazem frases simples, que reconhecem a perda sem minimizar a dor, e espaço para você escrever.\n\nConjunto com 3 cartões de 12 × 17 cm e envelopes.',
   3900, 3, false, false, '{/produtos/cartoes-acolhimento-1.webp}', 90),

  ('kit-acolhimento', 'Kit acolhimento', 'presentes',
   'Caderno de memórias, cartão escrito por você e sementes para plantar.',
   E'Um presente para mostrar a alguém que você se importa. O kit reúne o caderno de memórias com o nome do pet, um cartão com a sua mensagem (escrita à mão pela nossa equipe) e um pacote de sementes de girassol.\n\nEnviamos direto para a pessoa, se você preferir. É só informar o endereço dela no pedido.',
   14900, 7, false, true, '{/produtos/kit-acolhimento-1.webp}', 100)
on conflict (slug) do nothing;

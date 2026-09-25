# Dr. Franz Maier

Proposta de redesign com identidade azul e dourada, navegação responsiva e transições durante a rolagem.

## Executar localmente

Requer Node.js 18 ou superior, sem instalação de dependências.

```sh
npm start
```

Abra http://127.0.0.1:4173/. Para verificar páginas e referências locais, execute `npm test`.

## Estrutura

- `dist/`: versão atual editável em HTML, CSS e JavaScript, incluindo imagens originais e otimizadas.
- `preview.cjs`: servidor de prévia local.
- `validate.cjs`: verificação das referências internas das 13 páginas.
- `docs/revisao-conteudo-medico.md`: pontos para revisão pelo médico.

Edite diretamente os arquivos em `dist/`. Não há etapa de compilação. O site espera ser servido na raiz do domínio.

## Estado da proposta

Inclui nove páginas de procedimentos, navegação móvel, agendamento por WhatsApp, imagens responsivas e respeito à preferência de redução de movimento. Os textos médicos são rascunhos pendentes de validação pelo Dr. Franz. Vídeos do Instagram ainda não foram incorporados. Este repositório salva a proposta; não configura publicação automática.

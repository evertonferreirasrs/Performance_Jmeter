# Teste de Performance com Jmeter

Testes de performance de compra de passagem de avião utilizando o site: https://www.blazedemo.com

## Como executar aplicação

### Requisitos
* Jmeter versão = 5.5
* Java versão >= 1.8.0_371

### Executar
Para executar os testes é necessário clonar o repositório contendo os arquivos:
* blazedemo.jmx
* cidades.csv
* voo.csv
* compra.csv

## Interface Gráfica
* Realizar o download da release do [Jmeter](https://jmeter.apache.org).
* Criar uma pasta no disco local C: com o nome "Jmeter"
* Descompactar o pacote baixado dentro da pasta "Jmeter"
* Copiar os arquivos blazedemo.jmx, cidades.csv, voo.csv, compra.csv para dentro da pasta criada
* Acessar o seguinte caminho: apache-jmeter-5.5\bin
* Axecutar o arquivo bat com o seguinte nome: jmeter.bat
* Abrir o arquivo blazedemo.jmx no Jmeter e executar o teste.

## Linha de comando
* Realizar o download da release do [Jmeter](https://jmeter.apache.org).
* Descompactar o pacote baixado
* Abrir o prompt de comando e acessar o diretório onde o Jmeter foi descompactado até a pasta bin
* Executar o seguinte comando:
```
./jmeter.bat -n -t C:\Jmeter\blazedemo.jmx -l C:\Jmeter\resultado\resultado.jtl -e -o C:\Jmeter\resultado\Relatorio
```
## Significado dos parâmetros utilizados via prompt de comando
* -n: Não iniciar a interface gráfica
* -t: Qual plano de teste será executado
* -l: Onde irá salvar o resultado
* -e: Gerar relatório após a execução
* -o: Onde salvar o relatório

## Observações extras
Dentro do diretório possui uma pasta de nome "Relatórios" contendo dois arquivos csv com dados dos testes, o resultado do teste executado cia linha de comando com extenção .jtl e mais uma pasta relatorio com o restante dos dados gerados via linha de comando.

/* ==================================================================
   PALM — Cartão de Visita Digital
   Gera e baixa o arquivo de contato (.vcf) ao clicar em "Salvar contato".
   -------------------------------------------------------------------
   PARA PERSONALIZAR: edite só os valores abaixo com os dados reais.
   Eles alimentam tanto o arquivo .vcf quanto poderiam ser reaproveitados
   em outros lugares do cartão, se necessário.
   ================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const CONTATO = {
    nome: '[ Nome completo ]',
    cargo: '[ Cargo ]',
    empresa: 'PALM Projetos de Alto Padrão',
    telefone: '+55 17 99999-9999',
    email: 'contato@palm.com.br',
    site: 'https://www.palm.com.br',
    endereco: 'R. José Fabri, Vila Fabri, Colina - SP, 14772-052, Brasil'
  };

  function gerarVCard(c) {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${c.nome};;;;`,
      `FN:${c.nome}`,
      `ORG:${c.empresa}`,
      `TITLE:${c.cargo}`,
      `TEL;TYPE=CELL:${c.telefone}`,
      `EMAIL:${c.email}`,
      `URL:${c.site}`,
      `ADR;TYPE=WORK:;;${c.endereco}`,
      'END:VCARD'
    ].join('\n');
  }

  const btnSalvar = document.getElementById('btn-salvar-contato');
  if (btnSalvar) {
    btnSalvar.addEventListener('click', function (e) {
      e.preventDefault();
      const vcard = gerarVCard(CONTATO);
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'palm-contato.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

});

export default function ComunicacaoPage() {
  const channels = [
    {
      title: 'E-mail',
      endpoint: 'POST /api/email/send',
      description:
        'Envio de e-mails com suporte a templates (interpolação {{key}}). Fila in-memory com rastreamento de jobs.',
      endpoints: ['POST /api/email/send', 'GET /api/email/queue', 'GET /api/email/queue/:jobId'],
    },
    {
      title: 'SMS',
      endpoint: 'POST /api/sms/send',
      description:
        'Envio de SMS em formato E.164. Mensagens limitadas a 160 caracteres. Fila com controle de status.',
      endpoints: ['POST /api/sms/send', 'GET /api/sms/queue', 'GET /api/sms/queue/:jobId'],
    },
    {
      title: 'WhatsApp',
      endpoint: 'POST /api/whatsapp/send',
      description:
        'Suporte a mensagens de texto, mídia e templates. Fila in-memory com tipo de mensagem identificado.',
      endpoints: [
        'POST /api/whatsapp/send',
        'GET /api/whatsapp/queue',
        'GET /api/whatsapp/queue/:jobId',
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Comunicação</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Os canais de comunicação são gerenciados via API REST. Consulte os endpoints abaixo ou
        acesse a documentação Swagger em{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">http://localhost:3001/api/docs</code>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map((ch) => (
          <div key={ch.title} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">{ch.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{ch.description}</p>
            <div className="space-y-1">
              {ch.endpoints.map((ep) => (
                <div key={ep} className="font-mono text-xs bg-gray-50 border rounded px-2 py-1">
                  {ep}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="font-semibold text-blue-800 mb-1">Integração com provedores reais</h3>
        <p className="text-sm text-blue-700">
          Os módulos de comunicação utilizam filas in-memory por padrão. Para conectar a um provedor
          real (Twilio, SendGrid, Evolution API), substitua o provider no respectivo service sem
          alterar a interface do controller.
        </p>
      </div>
    </div>
  );
}

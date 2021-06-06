import { createServer, Factory, Model, Response, ActiveModelSerializer } from 'miragejs';
import faker from 'faker'; // Biblioteca para gerar dados falsos

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer, // Tipo de envio e recebimento de dados via API, é usado no Laravel, Adonis, Django, etc...
    },

    models: {
      user: Model.extend<Partial<User>>({}), // <Partial<User>> Indica que um usuário não precisa ter todos os campos
    },

    factories: {
      user: Factory.extend({ // Passa o nome do model
        name(i: number) {
          return `User ${i + 1}`; // O nome do usuário vai ser user + indíce
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10, new Date()); // Gera uma data a partir de hoje e no máximo 10 dias.
        },
      }),
    }, // Gerar dados em massa

    seeds(server) {
      server.createList('user', 200); // Gerar 200 usuários a partir da factory
    },

    routes() {
      this.namespace = 'api' // /api/users
      this.timing = 750; // Para testar os carregamentos, todas as chamadas vão demorar 750ms para acontecer

      this.get('/users', function(schema, request) {
        const {page = 1, per_page = 10} = request.queryParams;

        const total = schema.all('user').length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const users = this.serialize(schema.all('user')).users.slice(pageStart, pageEnd);

        return new Response(
          200, 
          {
            'x-total-count': String(total)
          },
          {
            users
          }
        )
      }); // Retorna a lista completa de usuários

      this.get('/users/:id');
      this.post('/users');

      this.namespace = ''; // Não prejudicar as rotas de API do Next
      this.passthrough(); // Se as rotas não forem encontradas pelo Mirage, a call passa adiante.
    }
  });

  return server;
}
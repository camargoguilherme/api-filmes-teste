define({ "api": [
  {
    "type": "get",
    "url": "/logout",
    "title": "Logout",
    "group": "Auth",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "profiles",
            "description": "<p>List of user profiles.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "profiles.age",
            "description": "<p>Users age.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profiles.image",
            "description": "<p>Avatar-Image.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/indexRoutes.js",
    "groupTitle": "Auth",
    "name": "GetLogout"
  },
  {
    "type": "post",
    "url": "/authenticated",
    "title": "Authenticated",
    "group": "Auth",
    "header": {
      "fields": {
        "": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header Exemplo",
          "content": "{\n  \"x-access-token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Nenhum token fornecido",
          "content": "HTTP/1.1 401 OK\n{\n  auth: false, \n  message: \"Nenhum token fornecido\"\n}",
          "type": "json"
        },
        {
          "title": "Falha ao autenticar token",
          "content": "HTTP/1.1 500 OK\n{\n  auth: false, \n  message: \"Falha ao autenticar token\"  \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/indexRoutes.js",
    "groupTitle": "Auth",
    "name": "PostAuthenticated"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Usuário.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Senha.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Login exemplo:",
          "content": "{\n  \"username\": \"username-example\",\n  \"password\": \"password-example\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n{\n  auth: true,\n  _id: \"5bd08c3304bf9a313bb9daf6\",\n  username: \"teste\",\n  token: \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"      \n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Usuário ou senha inválidos",
          "content": "HTTP/1.1 401 OK\n{\n  message: \"usuário ou senha inválidos\"\n}",
          "type": "json"
        },
        {
          "title": "Usuário não encontrado",
          "content": "HTTP/1.1 401 OK\n{\n  message: \"usuário não encontrado\"  \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/indexRoutes.js",
    "groupTitle": "Auth",
    "name": "PostLogin"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Signup",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Usuário.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Senha.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fullname",
            "description": "<p>Nome completo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Signup exemplo:",
          "content": "{\n  \"username\": \"teste\",\n  \"password\": \"teste123\",\n  \"fullname\": \"Teste Teste\",\n  \"email\": \"exemplo@teste.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n{\n  auth: true,\n  _id: \"5bd08c3304bf9a313bb9daf6\",\n  username: \"teste\",\n  token: \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"      \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/indexRoutes.js",
    "groupTitle": "Auth",
    "name": "PostSignup"
  },
  {
    "type": "get",
    "url": "/parse-filmes",
    "title": "Parsear Filmes",
    "group": "Parse",
    "permission": [
      {
        "name": "admin",
        "title": "Acesso permitido para admins",
        "description": "<p>O acesso a esse endpoint é permitido apenas para usuários admin</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "src/routes/parseRoutes.js",
    "groupTitle": "Parse",
    "name": "GetParseFilmes"
  },
  {
    "type": "get",
    "url": "/parse-preparar",
    "title": "Teste do parse",
    "group": "Parse",
    "permission": [
      {
        "name": "admin",
        "title": "Acesso permitido para admins",
        "description": "<p>O acesso a esse endpoint é permitido apenas para usuários admin</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "src/routes/parseRoutes.js",
    "groupTitle": "Parse",
    "name": "GetParsePreparar"
  },
  {
    "type": "get",
    "url": "/parse-series",
    "title": "Parsear Temporadas",
    "group": "Parse",
    "permission": [
      {
        "name": "admin",
        "title": "Acesso permitido para admins",
        "description": "<p>O acesso a esse endpoint é permitido apenas para usuários admin</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "src/routes/parseRoutes.js",
    "groupTitle": "Parse",
    "name": "GetParseSeries"
  },
  {
    "type": "get",
    "url": "/parse-series",
    "title": "Parsear Series",
    "group": "Parse",
    "permission": [
      {
        "name": "admin",
        "title": "Acesso permitido para admins",
        "description": "<p>O acesso a esse endpoint é permitido apenas para usuários admin</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "src/routes/parseRoutes.js",
    "groupTitle": "Parse",
    "name": "GetParseSeries"
  },
  {
    "type": "delete",
    "url": "/series/:serieId",
    "title": "Deletar serie",
    "group": "Series",
    "permission": [
      {
        "name": "admin",
        "title": "Acesso permitido para admins",
        "description": "<p>O acesso a esse endpoint é permitido apenas para usuários admin</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "serieId",
            "description": "<p>Id da Serie</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n{\n  \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/serieRoutes.js",
    "groupTitle": "Series",
    "name": "DeleteSeriesSerieid",
    "header": {
      "fields": {
        "": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header Exemplo ",
          "content": "{\n  \"x-access-token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Nenhum token fornecido",
          "content": "HTTP/1.1 401 OK\n{\n  auth: false, \n  message: \"Nenhum token fornecido\"\n}",
          "type": "json"
        },
        {
          "title": "Falha ao autenticar token",
          "content": "HTTP/1.1 500 OK\n{\n  auth: false, \n  message: \"Falha ao autenticar token\"  \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/series",
    "title": "Listar todas series",
    "group": "Series",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": " HTTP/1.1 200 OK\n [\n   { \n     \"_id\": \"5bf00fc03846d0e8ea842ed7\", \n     \"titulo\": \"Supernatural\", \n     \"__v\": 0, \n     \"createdAt\": \"2018-11-17T12:55:28.304Z\",\n     \"path\": \"Supernatural\", \n     \"posterStart\": \"https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg\", \n     \"updatedAt\": \"2018-11-17T13:34:11.220Z\", \n     \"uriPage\": \"https://tuaserie.com/serie/assistir-serie-supernatural-online/\"\n   },\n   { \n     \"_id\": \"5bf00fc43846d0e8ea842f1f\", \n     \"titulo\": \"Chicago MED\", \n     \"__v\": 0, \n     \"createdAt\": \"2018-11-17T12:55:32.552Z\", \n     \"path\": \"Chicago_MED\", \n     \"posterStart\": \"https://image.tmdb.org/t/p/w300/jMvkqK2uQbghLgZUNEhYL1SHT7e.jpg\",\n     \"updatedAt\": \"2018-11-17T12:58:45.876Z\", \n     \"uriPage\": \"https://tuaserie.com/serie/assistir-chicago-med/\"\n   },\n ...\n]",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titulo",
            "description": "<p>Titulo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "__v",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "posterStart",
            "description": "<p>Link.</p>"
          },
          {
            "group": "Success 200",
            "type": "updatedAt",
            "optional": false,
            "field": "series",
            "description": "<p>Series.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "uriPage",
            "description": "<p>Link.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/serieRoutes.js",
    "groupTitle": "Series",
    "name": "GetSeries",
    "header": {
      "fields": {
        "": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header Exemplo ",
          "content": "{\n  \"x-access-token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Nenhum token fornecido",
          "content": "HTTP/1.1 401 OK\n{\n  auth: false, \n  message: \"Nenhum token fornecido\"\n}",
          "type": "json"
        },
        {
          "title": "Falha ao autenticar token",
          "content": "HTTP/1.1 500 OK\n{\n  auth: false, \n  message: \"Falha ao autenticar token\"  \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/series/:serieId",
    "title": "Encontrar série",
    "group": "Series",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "serieId",
            "description": "<p>Id da Serie</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n{ \n  \"_id\": \"5bf00fc03846d0e8ea842ed7\", \n  \"titulo\": \"Supernatural\", \n  \"__v\": 0, \n  \"createdAt\": \"2018-11-17T12:55:28.304Z\",\n  \"path\": \"Supernatural\", \n  \"posterStart\": \"https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg\", \n  \"updatedAt\": \"2018-11-17T13:34:11.220Z\", \n  \"uriPage\": \"https://tuaserie.com/serie/assistir-serie-supernatural-online/\"\n},",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titulo",
            "description": "<p>Titulo.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "__v",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "posterStart",
            "description": "<p>Link.</p>"
          },
          {
            "group": "Success 200",
            "type": "updatedAt",
            "optional": false,
            "field": "series",
            "description": "<p>Series.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "uriPage",
            "description": "<p>Link.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/serieRoutes.js",
    "groupTitle": "Series",
    "name": "GetSeriesSerieid",
    "header": {
      "fields": {
        "": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header Exemplo ",
          "content": "{\n  \"x-access-token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Nenhum token fornecido",
          "content": "HTTP/1.1 401 OK\n{\n  auth: false, \n  message: \"Nenhum token fornecido\"\n}",
          "type": "json"
        },
        {
          "title": "Falha ao autenticar token",
          "content": "HTTP/1.1 500 OK\n{\n  auth: false, \n  message: \"Falha ao autenticar token\"  \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/series/",
    "title": "Criar serie",
    "group": "Series",
    "permission": [
      {
        "name": "admin",
        "title": "Acesso permitido para admins",
        "description": "<p>O acesso a esse endpoint é permitido apenas para usuários admin</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "titulo",
            "description": "<p>Titulo da Serie</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<p>Titulo da Serie</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "posterStart",
            "description": "<p>Link do poster da Serie</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uriPage",
            "description": "<p>Link da Serie</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Exemplo de serie",
          "content": "{\n  \"titulo\": \"Supernatural\", \n  \"path\": \"Supernatural\", \n  \"posterStart\": \"https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg\", \n  \"uriPage\": \"https://tuaserie.com/serie/assistir-serie-supernatural-online/\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n  { \n    \"_id\": \"5bf00fc03846d0e8ea842ed7\", \n    \"titulo\": \"Supernatural\", \n    \"__v\": 0, \n    \"createdAt\": \"2018-11-17T12:55:28.304Z\",\n    \"path\": \"Supernatural\", \n    \"posterStart\": \"https://image.tmdb.org/t/p/w300/3iFm6Kz7iYoFaEcj4fLyZHAmTQA.jpg\", \n    \"updatedAt\": \"2018-11-17T13:34:11.220Z\", \n    \"uriPage\": \"https://tuaserie.com/serie/assistir-serie-supernatural-online/\"\n  },",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/serieRoutes.js",
    "groupTitle": "Series",
    "name": "PostSeries",
    "header": {
      "fields": {
        "": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header Exemplo ",
          "content": "{\n  \"x-access-token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Nenhum token fornecido",
          "content": "HTTP/1.1 401 OK\n{\n  auth: false, \n  message: \"Nenhum token fornecido\"\n}",
          "type": "json"
        },
        {
          "title": "Falha ao autenticar token",
          "content": "HTTP/1.1 500 OK\n{\n  auth: false, \n  message: \"Falha ao autenticar token\"  \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/series/:serieId",
    "title": "Atualizar serie",
    "group": "Series",
    "permission": [
      {
        "name": "admin",
        "title": "Acesso permitido para admins",
        "description": "<p>O acesso a esse endpoint é permitido apenas para usuários admin</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "titulo",
            "description": "<p>Titulo.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<p>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "posterStart",
            "description": "<p>Link para imagem de poster da Série.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uriPage",
            "description": "<p>Link da Série.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "series",
            "description": "<p>Series.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/serieRoutes.js",
    "groupTitle": "Series",
    "name": "PutSeriesSerieid",
    "header": {
      "fields": {
        "": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header Exemplo ",
          "content": "{\n  \"x-access-token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDA4YzMzMDRiZjlhMzEzYmI5ZGFmNiIsImlhdCI6MTU0MjU2MzY2NiwiZXhwIjoxNTQyNjUwMDY2fQ.PcuYabWqUDeGUPoUFFZix9widzkS5MB_5Bqw0XhrCU4\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Nenhum token fornecido",
          "content": "HTTP/1.1 401 OK\n{\n  auth: false, \n  message: \"Nenhum token fornecido\"\n}",
          "type": "json"
        },
        {
          "title": "Falha ao autenticar token",
          "content": "HTTP/1.1 500 OK\n{\n  auth: false, \n  message: \"Falha ao autenticar token\"  \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/",
    "title": "Status",
    "group": "Status",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Mensagens de status da API</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n{\n  title: \"Node Express API\",\n  version: \"0.0.1\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/app.js",
    "groupTitle": "Status",
    "name": "Get"
  }
] });

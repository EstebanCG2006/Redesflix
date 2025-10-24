flowchart LR
  %% Cluster de extracción
  subgraph Extract
    EX_OLD[extract_old<br/>CSV historico -> stg_old]
    EX_API[extract_api<br/>API prestadores -> stg_api]
    EX_NEW[extract_new<br/>CSV calidad -> stg_new]
  end

  %% Transform + Merge + Validate
  T[transform<br/>clean_* (prestadores/calidad)]
  M[merge_clean_sql<br/>consolidacion prestadores]
  V[validate<br/>DQ Quickcheck]

  %% Nueva dimension geo + dimensiones existentes
  G[build_dim_geo<br/>(dim_geo)]
  D1[build_dim_prestadores<br/>(dim_prestadores)]
  D2[build_dim_prestacion<br/>(dim_prestacion_geo)]
  D3[build_dim_calidad<br/>(dim_calidad_geo)]
  FK[add_geo_fks<br/>FKs a dim_geo (NOT VALID + VALIDATE)]

  EX_OLD --> T
  EX_API --> T
  EX_NEW --> T
  T --> M --> V --> G
  G --> D1 --> FK
  G --> D2 --> FK
  G --> D3 --> FK


erDiagram
  %% Dimension central geografica
  DIM_GEO {
    TEXT departamento PK
    TEXT municipio PK
  }

  %% Dimensiones conectadas a la geo (snowflake)
  DIM_PRESTADORES {
    TEXT departamento
    TEXT municipio
    TEXT provider_id PK
    TEXT nombre
    TEXT servicio
    TEXT estado
    TEXT clasificacion
    TEXT direccion
    TEXT telefono
    TEXT email
  }

  DIM_PRESTACION_GEO {
    TEXT departamento
    TEXT municipio
    INT  total_prestadores
    INT  acueducto_total
    INT  alcantarillado_total
    INT  aseo_total
    INT  operativos_total
    INT  suspendidos_total
  }

  DIM_CALIDAD_GEO {
    TEXT departamento
    TEXT municipio
    INT  puntos_monitoreo
    INT  mediciones
    INT  parametros_distintos
    TEXT estado_ph
    TEXT estado_cloro
    DATE fecha_ult_muestra
  }

  %% Relaciones snowflake (1:N por geo)
  DIM_GEO ||--o{ DIM_PRESTADORES    : "dep,mun"
  DIM_GEO ||--o{ DIM_PRESTACION_GEO : "dep,mun"
  DIM_GEO ||--o{ DIM_CALIDAD_GEO    : "dep,mun"



flowchart TD
  %% Fuentes
  subgraph Sources
    S1[CSV Historico<br/>Prestadores]
    S2[API Prestadores]
    S3[CSV Calidad del Agua]
  end

  %% Orquestacion Airflow
  subgraph Airflow
    A1[extract_old]
    A2[extract_api]
    A3[extract_new]
    A4[transform<br/>(clean_staging, clean_calidad)]
    A5[merge_clean_sql]
    A6[validate<br/>DQ Quickcheck]
    A7[build_dim_geo]
    A8[build_dim_prestadores]
    A9[build_dim_prestacion]
    A10[build_dim_calidad]
    A11[add_geo_fks]
  end

  %% Almacenamiento y Consumo
  subgraph Warehouse (PostgreSQL)
    W1[(stg_old)]
    W2[(stg_api)]
    W3[(stg_new)]
    W4[(clean_staging)]
    W5[(clean_calidad)]
    W6[(dim_geo)]
    W7[(dim_prestadores)]
    W8[(dim_prestacion_geo)]
    W9[(dim_calidad_geo)]
  end

  subgraph BI
    B1[Power BI / Dashboards<br/>KPIs]
  end

  %% Flujo de datos
  S1 --> A1 --> W1
  S2 --> A2 --> W2
  S3 --> A3 --> W3

  W1 --> A4
  W2 --> A4
  W3 --> A4
  A4 --> W4
  A4 --> W5
  A5 --> W4
  A6 --> W4
  A6 --> W5

  A7 --> W6
  A8 --> W7
  A9 --> W8
  A10 --> W9
  A11 --> W7
  A11 --> W8
  A11 --> W9

  W7 --> B1
  W8 --> B1
  W9 --> B1

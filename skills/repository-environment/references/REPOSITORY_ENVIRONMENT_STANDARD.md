# Estándar de entorno reproducible para repositorios

> **Propósito:** convertir este repositorio en un entorno de desarrollo reproducible, portable y operable por personas, agentes de IA, CI y editores sin depender de la configuración accidental de la máquina host.
>
> Este documento permite inspeccionar, estandarizar y documentar un entorno completo cuando el alcance lo requiere, o reconciliar una modificación acotada sobre un contrato sano.

---

## 0. Alcance y ciclo de evidencia

Elegir el alcance antes del inventario. Una modificación local conocida sobre un grafo de entorno sano permite una ruta acotada: anclar repo/branch/HEAD, localizar el artefacto y evidencia durables, inspeccionar la configuración afectada y comprobar sus invariantes obligatorios. Preservar configuración y evidencia válidas no afectadas; no repetir un inventario completo por empezar otra sesión.

La ruta profunda es obligatoria ante un contrato nuevo, alcance incierto, evidencia requerida ausente, contradicciones, drift o un invariante fallido; cambios de runtime, versiones, package manager, lockfiles, servicios, plataforma o ejecución CI; contratos públicos, persistencia/migraciones, secretos/auth/seguridad, firma/trust o riesgo de deployment/rollback/disponibilidad. Cargar matriz, checklist y detalle técnico cuando exista ese trigger. Las referencias siguen siendo autoritativas.

Distinguir evidencia reutilizable, invalidada y recién ejecutada/observada de supuestos o inferencias. Reutilizar bootstrap/doctor sólo con runtime/versiones, lockfiles, servicios y plataforma sin cambios y sin drift observado. Verificar resolución del ejecutable y versión efectiva en el proceso hijo real; el PATH del padre no prueba esa resolución. Repetir sólo checks invalidados más invariantes transversales obligatorios. Un PASS histórico o relato no prueba ejecución vigente.

## 1. Objetivo

El repositorio debe declarar de forma explícita y versionada:

- runtimes y compiladores;
- package managers;
- herramientas CLI relevantes;
- variables de entorno no secretas;
- comandos canónicos del proyecto;
- servicios locales necesarios;
- lockfiles;
- requisitos del host;
- configuración de CI;
- procedimiento de bootstrap;
- procedimiento de diagnóstico;
- reglas para agentes y desarrolladores.

El resultado esperado es que:

```text
persona / Codex / OpenCode / Claude Code / CI / editor
                         │
                         ▼
                contrato del repositorio
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     herramientas     entorno          tareas
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  servicios locales
                         │
                         ▼
                mismo comportamiento
```

La configuración global de la máquina NO debe ser la fuente de verdad del proyecto.

---

# 2. Principios obligatorios

## 2.1. Repo-owned environment

El repositorio es la fuente de verdad para su entorno de desarrollo.

No depender de que el usuario tenga casualmente en `PATH` la versión correcta de:

- Node.js;
- Python;
- Go;
- Rust;
- Java;
- pnpm/npm/yarn;
- Terraform;
- kubectl;
- linters;
- formatters;
- generadores;
- CLIs de proveedores;
- otras herramientas de desarrollo.

---

## 2.2. Versiones explícitas

Cuando una herramienta pueda afectar:

- builds;
- tests;
- generación de código;
- formato;
- lint;
- migraciones;
- schemas;
- comportamiento del runtime;
- artefactos reproducibles;

debe declararse una versión explícita o estar cubierta por un lockfile reproducible.

Evitar como contrato del repositorio:

```text
latest
current
lts/*
*
```

salvo que exista deliberadamente un lockfile que resuelva esa referencia y la política del equipo lo permita.

---

## 2.3. Ningún agente modifica el entorno global para arreglar un repo

Un agente NO debe, salvo autorización explícita:

- editar el PATH global;
- editar el PATH del usuario;
- cambiar permanentemente la versión global de Node/Python/etc.;
- desinstalar runtimes existentes;
- reemplazar el package manager global;
- modificar perfiles globales del shell;
- instalar servicios persistentes;
- modificar Docker Desktop globalmente;
- cambiar configuración global de Git;
- cambiar configuración global de NVM/fnm/pyenv/etc.

El entorno del proyecto debe aislarse del host.

---

## 2.4. Un único contrato, varias capas

No se intenta resolver todo con una sola herramienta.

La división recomendada es:

```text
mise
├── runtimes
├── CLIs
├── package managers cuando corresponda
├── variables no secretas
└── tareas / comandos canónicos

lockfiles nativos
├── pnpm-lock.yaml
├── package-lock.json
├── uv.lock / poetry.lock
├── Cargo.lock
├── go.sum
└── equivalentes

Docker Compose
└── servicios locales y dependencias de infraestructura

Dev Container (opcional)
└── entorno de SO reproducible cuando el proyecto lo requiera

CI
└── valida el mismo contrato del repositorio
```

---

# 3. Herramienta principal recomendada: mise

Para repositorios nuevos o repositorios que necesiten estandarización multiplataforma, usar **mise** como administrador del toolchain del proyecto.

`mise` debe considerarse la capa encargada de:

- seleccionar versiones por proyecto;
- instalar herramientas declaradas;
- exponerlas al proceso;
- administrar variables no secretas;
- proporcionar comandos/tareas uniformes;
- funcionar desde shell, editor y CI.

Archivo principal:

```text
mise.toml
```

Cuando la política de reproducibilidad lo justifique, agregar:

```text
mise.lock
```

y activar locking.

Ejemplo mínimo:

```toml
[settings]
lockfile = true

[tools]
node = "24.21.0"
python = "3.13.7"

[env]
APP_ENV = "development"

[tasks.check]
run = "echo environment-ready"
```

Después:

```bash
mise install
mise run check
```

---

# 4. Mise debe cubrir todo el toolchain relevante

Durante la inspección del repositorio, identificar TODAS las herramientas necesarias.

Ejemplos:

```toml
[tools]
node = "24.21.0"
python = "3.13.7"
go = "1.25.1"
rust = "1.90.0"
terraform = "1.13.3"
kubectl = "1.34.1"
```

No agregar herramientas que el repositorio no use.

No convertir `mise.toml` en un inventario del workstation.

Debe representar únicamente las dependencias del proyecto.

---

# 5. Package managers

Los package managers y sus lockfiles continúan siendo parte del contrato.

## Node.js

Conservar en `package.json`:

```json
{
  "packageManager": "pnpm@11.19.0"
}
```

y mantener:

```text
pnpm-lock.yaml
```

No eliminar `packageManager` solo porque mise gestione Node.

Cuando el repo use Corepack de forma deliberada, mantener esa política documentada.

El objetivo es tener dos niveles de contrato:

```text
mise.toml
└── runtime/toolchain

package.json + pnpm-lock.yaml
└── ecosistema Node y dependencias
```

---

## Python

Preferir un mecanismo reproducible con lockfile, por ejemplo:

```text
pyproject.toml
uv.lock
```

o el equivalente ya adoptado por el proyecto.

No migrar el package manager de Python sin una razón explícita.

---

## Rust

Conservar:

```text
Cargo.toml
Cargo.lock
```

y cualquier archivo oficial del toolchain que ya sea parte del proyecto cuando sea necesario.

---

## Go

Conservar:

```text
go.mod
go.sum
```

---

# 6. Servicios locales: Docker Compose

Bases de datos, colas, emuladores y otros servicios locales NO deben arrancarse como procesos globales arbitrarios cuando puedan declararse reproduciblemente.

Preferir:

```text
compose.yaml
```

o:

```text
docker-compose.yml
```

Ejemplos de servicios:

- PostgreSQL;
- Redis;
- Supabase;
- MinIO;
- RabbitMQ;
- Elasticsearch;
- servicios auxiliares del proyecto.

La configuración debe:

1. usar nombres de proyecto previsibles cuando sea conveniente;
2. declarar healthchecks cuando sea posible;
3. evitar colisionar con stacks ajenos;
4. documentar volúmenes persistentes;
5. evitar destruir datos por defecto;
6. separar tests efímeros de servicios persistentes.

Crear tareas canónicas:

```toml
[tasks."services:up"]
run = "docker compose up -d"

[tasks."services:down"]
run = "docker compose down"

[tasks."services:status"]
run = "docker compose ps"
```

No hacer:

```text
docker system prune -a
docker volume prune
```

como parte de bootstrap, tests o limpieza normal.

---

# 7. Dependencias del sistema operativo

`mise` administra herramientas de desarrollo, pero no debe fingirse que todos los proyectos son independientes del sistema operativo.

Si el proyecto requiere:

- bibliotecas nativas;
- toolchains del SO;
- headers;
- paquetes apt/brew/winget;
- servicios del sistema;
- extensiones específicas;
- configuración compleja de Linux;

hay dos opciones.

## Opción A — requisito documentado del host

Usar cuando los requisitos son pequeños.

Ejemplo:

```markdown
Host prerequisites:

- Git
- Docker Desktop
- mise
```

## Opción B — Development Container

Usar cuando la paridad del sistema operativo es importante.

Agregar:

```text
.devcontainer/
└── devcontainer.json
```

El Dev Container debe complementar al contrato del proyecto, no crear un segundo contrato contradictorio.

Preferentemente debe ejecutar o respetar las mismas tareas y versiones declaradas en el repositorio.

---

# 8. Cuándo usar Dev Containers

Agregar Dev Container cuando exista al menos una de estas necesidades:

- múltiples dependencias nativas difíciles de reproducir;
- fuerte dependencia de Linux;
- diferencias Windows/macOS/Linux que generen errores frecuentes;
- onboarding complejo;
- equipo grande con entornos heterogéneos;
- necesidad de aislar completamente herramientas del host.

NO introducir Dev Containers solo para resolver una versión de Node o Python.

Para ese caso, mise es suficiente y menos pesado.

---

# 9. Variables de entorno

Separar tres categorías.

## 9.1. Valores públicos y deterministas

Pueden declararse en `mise.toml`.

Ejemplo:

```toml
[env]
NODE_ENV = "development"
LOG_LEVEL = "info"
```

---

## 9.2. Valores locales no secretos

Pueden vivir en:

```text
mise.local.toml
```

que normalmente debe ignorarse en Git.

---

## 9.3. Secretos

Nunca incluir valores secretos reales en:

```text
mise.toml
AGENTS.md
README.md
.env.example
CI versionado
```

Proporcionar únicamente nombres y ejemplos seguros:

```text
.env.example
```

Ejemplo:

```dotenv
DATABASE_URL=
OPENAI_API_KEY=
```

Los secretos reales deben provenir del mecanismo aprobado:

- variables del CI;
- secret manager;
- `.env.local` ignorado;
- mecanismo equivalente.

---

# 10. Tareas canónicas

Los desarrolladores y agentes no deberían tener que reconstruir mentalmente comandos largos.

Definir una interfaz estable.

Como mínimo, evaluar la creación de:

```text
mise run bootstrap
mise run doctor
mise run install
mise run dev
mise run test
mise run test:local
mise run lint
mise run format
mise run typecheck
mise run build
mise run quality
mise run quality:ci
mise run services:up
mise run services:down
```

Solo crear tareas que tengan sentido para el repositorio.

Las tareas pueden llamar internamente a scripts existentes.

Ejemplo:

```toml
[tasks.install]
run = "pnpm install --frozen-lockfile"

[tasks.test]
run = "pnpm test"

[tasks.build]
run = "pnpm build"

[tasks.quality]
depends = ["lint", "typecheck", "test"]

[tasks.lint]
run = "pnpm lint"

[tasks.typecheck]
run = "pnpm typecheck"
```

No duplicar lógica compleja ya existente en `package.json`, scripts Python, Makefiles u otros recursos.

La tarea de mise debe ser una interfaz/orquestación, no necesariamente una reimplementación.

---

# 11. Bootstrap

Debe existir una entrada inequívoca para preparar el repositorio.

Ejemplo:

```bash
mise install
mise run bootstrap
```

`bootstrap` debe ser:

- idempotente;
- seguro;
- limitado al repositorio;
- explícito sobre cualquier operación con red;
- incapaz de destruir datos existentes silenciosamente.

Debe poder:

- instalar dependencias del proyecto;
- comprobar archivos requeridos;
- crear archivos locales a partir de ejemplos cuando sea seguro;
- preparar hooks locales si el proyecto los usa;
- mostrar próximos pasos.

No debe:

- borrar bases de datos;
- regenerar secretos;
- sobrescribir `.env.local`;
- limpiar Docker global;
- cambiar configuración global de la máquina.

---

# 12. Doctor / preflight

Todo repo estandarizado debe tener una comprobación rápida:

```bash
mise run doctor
```

Debe validar, según corresponda:

- mise disponible;
- herramientas correctas;
- runtime efectivo;
- package manager;
- lockfiles presentes;
- Docker accesible;
- daemon de Docker operativo;
- servicios requeridos;
- archivos de configuración requeridos;
- puertos críticos;
- variables requeridas por nombre;
- arquitectura soportada;
- shell/OS cuando sea relevante.

Nunca imprimir valores secretos.

Salida deseada:

```text
PASS Node       24.21.0
PASS pnpm       11.19.0
PASS Docker     reachable
PASS lockfile   pnpm-lock.yaml
PASS env        required names present

ENVIRONMENT READY
```

---

# 13. CI debe validar el mismo contrato

La CI no debe ser una definición paralela y divergente.

Siempre que sea viable:

1. instalar mise;
2. instalar las herramientas declaradas;
3. ejecutar las mismas tareas canónicas.

Conceptualmente:

```yaml
- checkout
- install mise
- mise install
- mise run quality:ci
```

Si la plataforma CI usa una acción especializada —por ejemplo `actions/setup-node`— su versión debe provenir de una fuente versionada del repositorio, no de una copia manual que pueda divergir.

GitHub `setup-node` admite archivos como:

```text
.nvmrc
.node-version
.tool-versions
mise.toml
package.json
```

Evitar:

```yaml
node-version: 24
```

si el repositorio exige exactamente:

```text
24.21.0
```

y no existe una política deliberada de rango.

---

# 14. Compatibilidad con archivos existentes

Durante una migración NO eliminar automáticamente:

```text
.node-version
.nvmrc
.tool-versions
.python-version
rust-toolchain.toml
```

Primero determinar:

- quién los consume;
- si CI los usa;
- si editores los usan;
- si otros desarrolladores dependen de ellos;
- si existe documentación externa que los referencia.

Puede mantenerse temporalmente más de un descriptor si todos expresan el mismo valor.

Debe documentarse cuál es la fuente canónica.

Objetivo final recomendado:

```text
mise.toml
└── contrato principal del toolchain

archivos ecosistema
└── compatibilidad cuando aporten valor
```

---

# 15. Locking del toolchain

Para proyectos que requieran alta reproducibilidad:

```toml
[settings]
lockfile = true

[tool_config]
locked = true
```

Generar y versionar:

```text
mise.lock
```

El lockfile puede fijar:

- versión efectiva;
- URL del artefacto;
- checksum cuando el backend lo soporta;
- plataforma.

Esto reduce diferencias entre máquinas y evita resolver herramientas de forma distinta en ejecuciones futuras.

No editar `mise.lock` manualmente.

---

# 16. Monorepos

Si el repositorio es monorepo:

1. identificar toolchains globales;
2. identificar toolchains específicos por paquete;
3. evitar replicar configuración innecesariamente;
4. usar configuración de monorepo soportada por mise cuando corresponda;
5. decidir explícitamente la política de lockfiles.

No asumir que todos los paquetes requieren la misma versión de todas las herramientas.

---

# 17. Política para agentes de IA

Agregar a `AGENTS.md` o equivalente:

```markdown
## Repository environment

This repository owns its development environment.

Before executing project commands:

1. Read `mise.toml`.
2. Select bounded/deep scope; load this standard for affected policy or deep work.
3. Run `mise install` only when required.
4. Verify effective executable/version in the child process; reuse durable doctor
   evidence only with unchanged runtime, lock, service and platform invariants
   and no observed drift. Otherwise run the required doctor/preflight.
5. Prefer canonical `mise run <task>` commands over ad-hoc equivalents.
6. Do not modify global PATH, shell profiles, runtime defaults, Docker global
   configuration, or host-wide package managers to make the repository pass.
7. Do not replace pinned tool versions unless the task explicitly requires an
   upgrade.
8. Do not delete or regenerate lockfiles unless required by an intentional
   dependency/toolchain change.
9. Do not inspect or print secret values.
10. Do not destroy persistent Docker volumes or unrelated containers.
11. If the environment contract and actual repository disagree, stop the
    destructive action and report the discrepancy.
12. CI, humans and agents should run the same canonical quality gates.
```

---

# 18. Procedimiento de estandarización para un agente

Cuando recibas este documento dentro de un repositorio, NO empieces modificando archivos.

Para contratos nuevos, migraciones o triggers profundos, ejecutar las siguientes fases. Para una enmienda acotada sana, reconciliar sólo las fases/configuraciones afectadas y sus invariantes; conservar decisiones y evidencia válidas.

---

## Fase 1 — Inventario

Inspeccionar:

```text
README*
AGENTS.md
package.json
pnpm-lock.yaml
package-lock.json
yarn.lock
pyproject.toml
uv.lock
poetry.lock
requirements*.txt
Cargo.toml
Cargo.lock
go.mod
go.sum
Dockerfile*
compose*.yml
compose*.yaml
.devcontainer/
.github/workflows/
Makefile
justfile
Taskfile*
scripts/
.nvmrc
.node-version
.tool-versions
.python-version
rust-toolchain*
.env.example
.gitignore
```

También inspeccionar comandos de CI y documentación.

No leer valores secretos.

---

## Fase 2 — Construir el grafo del entorno

Crear internamente una tabla:

| Capa | Herramienta | Versión/fuente actual | Requerida | Fuente actual |
|---|---|---:|---:|---|
| Runtime | Node | ... | ... | ... |
| Runtime | Python | ... | ... | ... |
| Package manager | pnpm | ... | ... | package.json |
| Service | PostgreSQL | ... | ... | compose |
| CLI | Terraform | ... | ... | CI |
| Quality | ESLint | package dep | package dep | lockfile |

Detectar contradicciones antes de editar.

---

## Fase 3 — Elegir fuentes canónicas

Aplicar estas reglas:

### Toolchain y CLI

```text
mise.toml + mise.lock
```

### Dependencias de aplicación

Usar lockfile nativo del ecosistema.

### Servicios

```text
Docker Compose
```

### SO completamente reproducible

```text
Dev Container
```

solo cuando se justifique.

### Secretos

Sistema externo / archivo local ignorado.

---

## Fase 4 — Migración mínima

Hacer el cambio mínimo que consiga:

```text
una versión declarada
+
una forma canónica de instalar
+
una forma canónica de ejecutar
+
una forma canónica de verificar
```

No hacer refactors no relacionados.

No actualizar versiones solo porque exista una versión más nueva.

---

## Fase 5 — Crear/ajustar `mise.toml`

Ejemplo genérico:

```toml
[settings]
lockfile = true

[tool_config]
locked = true

[tools]
node = "24.21.0"

[env]
NODE_ENV = "development"

[tasks.doctor]
run = "node scripts/doctor.mjs"

[tasks.install]
run = "pnpm install --frozen-lockfile"

[tasks.dev]
run = "pnpm dev"

[tasks.test]
run = "pnpm test"

[tasks.quality]
run = "pnpm quality"

[tasks."services:up"]
run = "docker compose up -d"

[tasks."services:down"]
run = "docker compose down"
```

Adaptar al repo real.

NO copiar herramientas o tareas irrelevantes.

---

## Fase 6 — Lock

Generar/actualizar el lock del toolchain mediante mise.

Validar que el archivo sea apropiado para las plataformas soportadas.

Versionarlo cuando la política de reproducibilidad lo requiera.

---

## Fase 7 — Doctor

Crear una comprobación no destructiva.

Debe detectar:

- runtime equivocado;
- herramienta ausente;
- Docker no accesible;
- archivo requerido ausente;
- contradicción entre manifiestos;
- lockfile faltante;
- servicio requerido caído.

---

## Fase 8 — CI

Alinear CI al contrato.

El gate CI debe terminar invocando, cuando sea viable:

```bash
mise run quality:ci
```

o la tarea canónica equivalente.

No mantener dos implementaciones distintas del quality gate.

---

## Fase 9 — Documentación humana

Actualizar README / CONTRIBUTING:

```text
Prerequisites:
- Git
- mise
- Docker (si aplica)

Bootstrap:
mise install
mise run bootstrap

Verify:
mise run doctor

Develop:
mise run dev

Quality:
mise run quality

Services:
mise run services:up
```

---

## Fase 10 — Validación final

Validar desde un proceso limpio.

Si el contrato usa mise, ejecutar lo necesario según evidencia invalidada y requisitos; instalar sólo cuando falten o cambien prerequisites:

```bash
mise install
mise run doctor
mise run quality
```

y, si aplica:

```bash
mise run services:up
mise run test:local
mise run services:down
```

Comprobar `git status`.

El entorno no debe haber:

- modificado archivos globales;
- tocado repos ajenos;
- destruido datos;
- cambiado runtimes globales;
- creado secretos versionados.

---

# 19. Qué NO hacer

No adoptar soluciones ad-hoc como fuente principal del entorno si existe una herramienta mantenida y multiplataforma para ese propósito.

Evitar como arquitectura principal:

```text
scripts/repo-env.ps1
scripts/repo-env.sh
scripts/select-node.cmd
scripts/fix-path.ps1
```

Estos scripts pueden existir para compatibilidad o tareas específicas, pero no deberían sustituir un gestor de toolchain por proyecto.

Tampoco usar:

```text
nvm use
pyenv local
PATH=...
```

como único contrato del repo.

Pueden ser herramientas personales compatibles, pero el proyecto no debe depender de que cada desarrollador configure manualmente el mismo estado.

---

# 20. Excepciones

No imponer mise si el repositorio YA posee un entorno reproducible, estable y documentado mediante otro sistema equivalente, por ejemplo:

- Nix flake/devShell;
- Bazel toolchains;
- Dev Container integral;
- asdf bien estandarizado;
- sistema corporativo equivalente.

En ese caso:

1. evaluar primero el sistema existente;
2. no introducir un segundo gestor sin necesidad;
3. corregir inconsistencias dentro del estándar ya adoptado.

El objetivo es reproducibilidad, no introducir mise por moda.

---

# 21. Criterios de aceptación

La estandarización está completa cuando:

- [ ] el toolchain está declarado en el repo;
- [ ] las versiones relevantes son reproducibles;
- [ ] los lockfiles correctos están versionados;
- [ ] una persona nueva puede preparar el repo siguiendo documentación corta;
- [ ] un agente puede descubrir cómo operar sin adivinar;
- [ ] CI usa el mismo contrato;
- [ ] Docker solo administra servicios propios del proyecto;
- [ ] no se depende del runtime accidental del host;
- [ ] no se modifican configuraciones globales para hacer pasar el repo;
- [ ] existe un `doctor` o preflight;
- [ ] existen tareas canónicas;
- [ ] secretos y configuración local están separados;
- [ ] los quality gates pasan desde un entorno limpio;
- [ ] los cambios están documentados.

---

# 22. Resultado esperado para Windows

En Windows, un proyecto correctamente configurado debe poder hacer:

```powershell
mise install
mise run doctor
mise run quality
```

sin importar si el proceso padre fue iniciado por:

```text
PowerShell
Windows Terminal
VS Code
Codex
OpenCode
Claude Code
otro agente
```

El Node/Python/Go/etc. empaquetado por una aplicación host no debe convertirse accidentalmente en el runtime del proyecto.

Para procesos que no cargan el perfil del shell, usar:

```powershell
mise exec -- <comando>
```

o:

```powershell
mise run <tarea>
```

en lugar de confiar en la activación interactiva del shell.

---

# 23. Capas de reproducibilidad

Pensar el entorno como niveles:

```text
Nivel 1
Repositorio
├── mise.toml
├── mise.lock
└── lockfiles de dependencias

Nivel 2
Servicios
└── Docker Compose

Nivel 3
Sistema operativo reproducible (cuando sea necesario)
└── Dev Container

Nivel 4
Automatización
└── CI ejecutando los mismos gates
```

No subir de nivel sin necesidad.

Para muchos proyectos:

```text
mise + lockfiles + Compose + CI
```

es suficiente.

Para proyectos con fuerte dependencia del sistema operativo:

```text
mise + lockfiles + Compose + Dev Container + CI
```

puede ser apropiado.

---

# 24. Referencias técnicas

Este estándar se basa en documentación y prácticas mantenidas públicamente.

## mise

- Proyecto:
  https://github.com/jdx/mise
- Documentación:
  https://mise.jdx.dev/
- Configuración:
  https://github.com/jdx/mise/blob/main/docs/configuration.md
- Tareas:
  https://github.com/jdx/mise/blob/main/docs/tasks/task-configuration.md
- Lockfiles:
  https://mise.jdx.dev/dev-tools/mise-lock.html

## GitHub Actions

- setup-node:
  https://github.com/actions/setup-node
- Uso de version files:
  https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md

## asdf

Referencia histórica y alternativa válida de versionado multipropósito:

- https://asdf-vm.com/
- https://github.com/asdf-vm/asdf

## Dev Container Specification

- https://containers.dev/
- https://github.com/devcontainers/spec

## Nix

Alternativa de mayor aislamiento/reproducibilidad cuando el proyecto ya adopta Nix:

- https://wiki.nixos.org/wiki/Flakes

## Volta

Volta fue una solución reconocida para toolchains JavaScript por proyecto, pero su propio proyecto indica actualmente que está sin mantenimiento y recomienda migrar a mise:

- https://github.com/volta-cli/volta
- https://github.com/volta-cli/volta/issues/2080

---

# 25. Instrucción final al agente

Al recibir este documento:

> Elige ruta acotada o profunda según alcance y evidencia. En una modificación local sobre un entorno sano, inspecciona la configuración afectada, reutiliza evidencia durable aún válida y verifica los invariantes obligatorios. Inspecciona el repositorio completo y su CI cuando un contrato nuevo, una contradicción, drift o un cambio material active la ruta profunda. No asumas que Node es el único runtime ni que mise debe reemplazar un sistema reproducible existente. Aplica la migración mínima autorizada, conserva lockfiles y datos, y no modifiques configuración global. Verifica ejecutable y versión en el proceso hijo real; ejecuta doctor y quality gates invalidados o requeridos, y documenta evidencia reutilizada, nueva, invalidada y riesgos pendientes.

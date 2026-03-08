interface RepoSummary {
  language: string;
  framework: string;
  projectType: string;
  packageManager: string;
}

export function analyzeRepository(filePaths: string[]): RepoSummary {
  const files = filePaths.map((f) => f.toLowerCase());
  const fileSet = new Set(files);

  const has = (...patterns: string[]) =>
    patterns.some((p) =>
      files.some((f) =>
        p.startsWith("*") ? f.endsWith(p.slice(1)) : f.includes(p),
      ),
    );

  const hasExt = (...exts: string[]) =>
    exts.some((ext) => files.some((f) => f.endsWith(ext)));

  const hasExact = (...names: string[]) => names.some((n) => fileSet.has(n));

  // ─────────────────────────────────────────
  // LANGUAGE DETECTION (priority order)
  // ─────────────────────────────────────────
  const language = (() => {
    if (hasExt(".ts", ".tsx")) return "TypeScript";
    if (hasExt(".js", ".jsx", ".mjs", ".cjs")) return "JavaScript";
    if (hasExt(".py", ".pyw", ".pyx")) return "Python";
    if (hasExt(".go")) return "Go";
    if (hasExt(".rs")) return "Rust";
    if (hasExt(".java")) return "Java";
    if (hasExt(".kt", ".kts")) return "Kotlin";
    if (hasExt(".swift")) return "Swift";
    if (hasExt(".cs")) return "C#";
    if (hasExt(".cpp", ".cc", ".cxx", ".c++")) return "C++";
    if (hasExt(".c", ".h")) return "C";
    if (hasExt(".rb")) return "Ruby";
    if (hasExt(".php")) return "PHP";
    if (hasExt(".ex", ".exs")) return "Elixir";
    if (hasExt(".hs", ".lhs")) return "Haskell";
    if (hasExt(".scala")) return "Scala";
    if (hasExt(".dart")) return "Dart";
    if (hasExt(".lua")) return "Lua";
    if (hasExt(".r", ".rmd")) return "R";
    if (hasExt(".jl")) return "Julia";
    if (hasExt(".m", ".mm")) return "Objective-C";
    if (hasExt(".pl", ".pm")) return "Perl";
    if (hasExt(".sh", ".bash", ".zsh")) return "Shell";
    if (hasExt(".ps1", ".psm1")) return "PowerShell";
    if (hasExt(".tf", ".tfvars")) return "HCL (Terraform)";
    if (hasExt(".sol")) return "Solidity";
    if (hasExt(".zig")) return "Zig";
    if (hasExt(".clj", ".cljs")) return "Clojure";
    if (hasExt(".erl", ".hrl")) return "Erlang";
    if (hasExt(".f90", ".f95", ".f03")) return "Fortran";
    if (hasExt(".groovy")) return "Groovy";
    if (hasExt(".v")) return "V";
    if (hasExt(".nim")) return "Nim";
    if (hasExt(".cr")) return "Crystal";
    return "Unknown";
  })();

  // ─────────────────────────────────────────
  // FRAMEWORK DETECTION
  // ─────────────────────────────────────────
  const framework = (() => {
    // ── JavaScript / TypeScript ──
    if (has("next.config.ts", "next.config.js", "next.config.mjs"))
      return "Next.js";
    if (has("nuxt.config.ts", "nuxt.config.js")) return "Nuxt.js";
    if (has("svelte.config.js", "svelte.config.ts")) return "SvelteKit";
    if (has("astro.config.mjs", "astro.config.ts")) return "Astro";
    if (has("remix.config.js", "remix.config.ts")) return "Remix";
    if (has("angular.json")) return "Angular";
    if (has("vite.config.ts", "vite.config.js")) return "Vite";
    if (has("gatsby-config.js", "gatsby-config.ts")) return "Gatsby";
    if (has("expo.json", "expo-router")) return "Expo (React Native)";
    if (has("react-native.config.js", "metro.config.js")) return "React Native";
    if (has("ember-cli-build.js")) return "Ember.js";
    if (has("quasar.config.js", "quasar.conf.js")) return "Quasar";
    if (has("vue.config.js", "vue.config.ts")) return "Vue.js";
    if (has("nest-cli.json", "nestjs")) return "NestJS";
    if (has("hono")) return "Hono";
    if (hasExact("server.js", "server.ts") && has("express"))
      return "Express.js";
    if (has("fastify")) return "Fastify";
    if (has("electron-builder.yml", "electron.js")) return "Electron";
    if (has("wrangler.toml")) return "Cloudflare Workers";
    if (has("tauri.conf.json", "src-tauri/")) return "Tauri";

    // ── Python ──
    if (has("manage.py") && has("django")) return "Django";
    if (has("alembic.ini") || (has("models.py") && has("routers/")))
      return "FastAPI";
    if (has("app.py", "wsgi.py") && !has("manage.py")) return "Flask";
    if (has("pyproject.toml") && has("streamlit")) return "Streamlit";
    if (has("gradio")) return "Gradio";
    if (has("celery.py", "celeryconfig.py")) return "Celery";
    if (has("airflow") || has("dags/")) return "Apache Airflow";
    if (has("prefect")) return "Prefect";

    // ── Ruby ──
    if (hasExact("gemfile") && has("config/routes.rb")) return "Ruby on Rails";
    if (hasExact("gemfile") && has("config.ru")) return "Sinatra / Rack";

    // ── PHP ──
    if (has("artisan") || has("bootstrap/app.php")) return "Laravel";
    if (has("symfony.lock")) return "Symfony";
    if (has("wp-config.php", "wp-content/")) return "WordPress";
    if (has("codeception.yml") && has("src/")) return "Yii";

    // ── Go ──
    if (has("go.mod") && has("cmd/", "internal/"))
      return "Go (Standard Layout)";
    if (has("go.mod") && has("gin")) return "Gin (Go)";
    if (has("go.mod") && has("fiber")) return "Fiber (Go)";
    if (has("go.mod") && has("echo")) return "Echo (Go)";
    if (hasExt(".go")) return "Go Modules";

    // ── Rust ──
    if (has("cargo.toml") && has("actix")) return "Actix Web (Rust)";
    if (has("cargo.toml") && has("axum")) return "Axum (Rust)";
    if (hasExact("cargo.toml")) return "Cargo (Rust)";

    // ── Java / JVM ──
    if (has("pom.xml") && has("spring")) return "Spring Boot (Maven)";
    if (has("build.gradle") && has("spring")) return "Spring Boot (Gradle)";
    if (has("pom.xml")) return "Maven (Java)";
    if (has("build.gradle", "build.gradle.kts")) return "Gradle";
    if (has("build.sbt")) return "sbt (Scala)";
    if (has("mix.exs")) return "Mix / Phoenix (Elixir)";

    // ── .NET ──
    if (hasExt(".csproj") && has("blazor")) return "Blazor (.NET)";
    if (hasExt(".csproj", ".sln")) return "ASP.NET Core";

    // ── Mobile ──
    if (has("pubspec.yaml")) return "Flutter (Dart)";
    if (has("xcodeproj/", "xcworkspace/") && hasExt(".swift"))
      return "SwiftUI / UIKit";
    if (has("androidmanifest.xml") && hasExt(".kt")) return "Android (Kotlin)";

    // ── Infrastructure / DevOps ──
    if (hasExact("docker-compose.yml", "docker-compose.yaml"))
      return "Docker Compose";
    if (has("helmfile.yaml") || has("chart.yaml")) return "Helm (Kubernetes)";
    if (hasExt(".tf")) return "Terraform";
    if (has("ansible.cfg", "playbook.yml")) return "Ansible";
    if (has("pulumi.yaml")) return "Pulumi";
    if (has("serverless.yml", "serverless.ts")) return "Serverless Framework";
    if (has("sam.yaml", "template.yaml") && has("aws")) return "AWS SAM";
    if (has(".github/workflows/")) return "GitHub Actions";

    // ── Data / ML / AI ──
    if (has("notebook", "*.ipynb")) return "Jupyter Notebook";
    if (has("pytorch", "torch")) return "PyTorch";
    if (has("tensorflow", "keras")) return "TensorFlow / Keras";
    if (has("langchain", "langgraph")) return "LangChain";
    if (has("llamafile", "llama")) return "LLaMA / Local LLM";
    if (has("mlflow")) return "MLflow";

    // ── Static Site / Docs ──
    if (hasExact("_config.yml") && has("jekyll")) return "Jekyll";
    if (has("mkdocs.yml")) return "MkDocs";
    if (has("docusaurus.config.js", "docusaurus.config.ts"))
      return "Docusaurus";
    if (has("hugo.toml", "config.toml") && has("content/")) return "Hugo";
    if (has("eleventy.js", ".eleventy.js")) return "Eleventy (11ty)";
    if (has("gridsome.config.js")) return "Gridsome";

    return "Unknown";
  })();

  // ─────────────────────────────────────────
  // PROJECT TYPE DETECTION
  // ─────────────────────────────────────────
  const projectType = (() => {
    // Mobile
    if (has("pubspec.yaml") || has("androidmanifest.xml") || has("xcodeproj/"))
      return "Mobile Application";

    // Desktop
    if (has("src-tauri/") || has("electron-builder.yml") || has("mainwindow"))
      return "Desktop Application";

    // CLI
    if (has("cli/", "cmd/", "bin/") || hasExact("cli.ts", "cli.js", "cli.py"))
      return "CLI Tool";

    // Browser Extension
    if (
      hasExact("manifest.json") &&
      has("background.js", "content.js", "popup.html")
    )
      return "Browser Extension";

    // Smart Contracts / Web3
    if (
      hasExt(".sol") ||
      has("hardhat.config", "foundry.toml", "truffle-config.js")
    )
      return "Web3 / Smart Contracts";

    // Infrastructure / DevOps
    if (
      hasExt(".tf") ||
      has("ansible.cfg", "playbook.yml", "helmfile.yaml", "pulumi.yaml")
    )
      return "Infrastructure / DevOps";

    // Data / ML
    if (
      hasExt(".ipynb") ||
      has("models/", "datasets/", "notebooks/", "experiments/")
    )
      return "Data Science / ML";

    // Library / SDK / Package
    if (
      has("lib/", "src/index.ts", "src/index.js", "src/index.py") &&
      !has("app/", "pages/", "views/")
    )
      return "Library / Package";

    // API / Backend
    if (has("api/", "routes/", "controllers/", "handlers/", "endpoints/"))
      return "REST API / Backend Service";

    // Full-stack / Web App
    if (has("app/", "pages/", "views/", "src/app", "src/pages"))
      return "Web Application";

    // Monorepo
    if (
      hasExact("pnpm-workspace.yaml", "lerna.json", "nx.json", "turbo.json") ||
      has("packages/", "apps/")
    )
      return "Monorepo";

    // Docs / Static Site
    if (
      has("docs/", "content/", "_posts/", "mkdocs.yml", "docusaurus.config.js")
    )
      return "Documentation / Static Site";

    // Game
    if (has("assets/", "scenes/", "godot.project") || hasExt(".gd", ".unity"))
      return "Game";

    // Scripts / Automation
    if (hasExt(".sh", ".ps1", ".py") && !has("src/", "lib/", "app/"))
      return "Scripts / Automation";

    return "General Project";
  })();

  // ─────────────────────────────────────────
  // PACKAGE MANAGER DETECTION
  // ─────────────────────────────────────────
  const packageManager = (() => {
    // JS ecosystem
    if (hasExact("bun.lockb")) return "bun";
    if (hasExact("pnpm-lock.yaml")) return "pnpm";
    if (hasExact("yarn.lock")) return "yarn";
    if (hasExact("package-lock.json")) return "npm";

    // Python
    if (hasExact("poetry.lock")) return "poetry";
    if (hasExact("pipfile.lock")) return "pipenv";
    if (hasExact("pdm.lock")) return "pdm";
    if (hasExact("uv.lock")) return "uv";
    if (hasExact("requirements.txt")) return "pip";

    // Rust
    if (hasExact("cargo.lock")) return "cargo";

    // Ruby
    if (hasExact("gemfile.lock")) return "bundler";

    // PHP
    if (hasExact("composer.lock")) return "composer";

    // Go
    if (hasExact("go.sum")) return "go mod";

    // JVM
    if (hasExact("pom.xml")) return "maven";
    if (has("build.gradle")) return "gradle";
    if (hasExact("build.sbt")) return "sbt";

    // .NET
    if (hasExt(".csproj", ".fsproj")) return "dotnet";

    // Swift
    if (hasExact("package.resolved")) return "swift pm";

    // Dart / Flutter
    if (hasExact("pubspec.lock")) return "pub (dart)";

    // Elixir
    if (hasExact("mix.lock")) return "mix";

    // Nix
    if (hasExact("flake.lock")) return "nix flakes";

    return "unknown";
  })();

  return { language, framework, projectType, packageManager };
}

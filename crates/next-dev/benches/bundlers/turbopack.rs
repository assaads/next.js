use std::{
    path::Path,
    process::{Child, Command, Stdio},
};

use anyhow::{anyhow, Context, Result};
use regex::Regex;

use crate::{
    bundlers::Bundler,
    util::{npm, wait_for_match},
};

pub struct Turbopack {
    name: String,
    path: String,
    has_server_rendered_html: bool,
}

impl Turbopack {
    pub fn new(name: &str, path: &str, has_server_rendered_html: bool) -> Self {
        Turbopack {
            name: name.to_owned(),
            path: path.to_owned(),
            has_server_rendered_html,
        }
    }
}

impl Bundler for Turbopack {
    fn get_name(&self) -> &str {
        &self.name
    }

    fn get_path(&self) -> &str {
        &self.path
    }

    fn has_server_rendered_html(&self) -> bool {
        self.has_server_rendered_html
    }

    fn prepare(&self, install_dir: &Path) -> Result<()> {
        npm::install(install_dir, "react-refresh", "^0.12.0")
            .context("failed to install `react-refresh` module")?;
        npm::install(install_dir, "@next/react-refresh-utils", "^12.2.5")
            .context("failed to install `@next/react-refresh-utils` module")?;
        Ok(())
    }

    fn start_server(&self, test_dir: &Path) -> Result<(Child, String)> {
        let mut proc = Command::new(std::env!("CARGO_BIN_EXE_next-dev"))
            .args([
                test_dir
                    .to_str()
                    .ok_or_else(|| anyhow!("failed to convert test directory path to string"))?,
                "--no-open",
                "--port",
                "0",
            ])
            .stdout(Stdio::piped())
            .spawn()?;

        // Wait for the devserver address to appear in stdout.
        let addr = wait_for_match(
            proc.stdout
                .as_mut()
                .ok_or_else(|| anyhow!("missing stdout"))?,
            Regex::new("server listening on: (.*)")?,
        )
        .ok_or_else(|| anyhow!("failed to find devserver address"))?;

        Ok((proc, addr))
    }
}

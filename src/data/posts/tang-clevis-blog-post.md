---
title: "Automating LUKS Decryption with Tang and Clevis"
slug: "luks-tang-clevis"
image: ""
description: "Full disk encryption protects data at rest, but it comes with an operational cost: every reboot stops at a prompt waiting for someone to type a passphrase. For a single laptop, that's a minor inconvenience. For a fleet of servers or VMs that need to reboot unattended - after a kernel update, a power event, or a scheduled maintenance window - it's a real problem."
date: "2026-06-20"
categories: ["encryption", "luks", "tang", "clevis", "pi"]
published: true
---

Full disk encryption protects data at rest, but it comes with an operational cost: every reboot stops at a prompt waiting for someone to type a passphrase. For a single laptop, that's a minor inconvenience. For a fleet of servers or VMs that need to reboot unattended - after a kernel update, a power event, or a scheduled maintenance window - it's a real problem.

The usual workaround is to hand key management off to a cloud KMS. That solves the automation problem but introduces a new one: your encrypted infrastructure now depends on a third party's availability, API, and billing model. For anyone running a local-first or self-hosted setup, that trade-off isn't always acceptable.

Tang and Clevis solve the same problem without leaving your network.

## How It Works

Tang and Clevis split the unlock process into two pieces:

- **Tang** is a small, stateless server that runs on your local network. It holds a set of cryptographic keys but never sees the LUKS passphrase, the disk contents, or any client secrets. Its only job is to respond to a specific key-exchange request from clients it can reach.
- **Clevis** is the client-side component that runs on each encrypted machine. During boot, before the LUKS volume is unlocked, Clevis contacts the Tang server and performs the exchange. If the exchange succeeds, the disk unlocks automatically. If it fails - because the network is unreachable, or the Tang server is gone - Clevis falls back to the standard passphrase prompt.

The security model is what's called a "network bound" scheme: possession of the encrypted disk alone is not enough to unlock it. An attacker also needs access to the Tang server's key material, which in practice means being on the network (or having compromised the server itself).

## Why This Is Worth Setting Up

**No dependency on external infrastructure.** The entire setup lives on hardware you control. There's no account, no API key, no recurring cost, and no risk of a provider changing terms or having an outage that locks you out of your own machines.

**Unattended reboots become safe.** Automated patching, scheduled restarts, and power-loss recovery no longer require someone to walk over to a console or open a remote KVM session just to enter a password.

**Theft resistance is built in.** If a machine is physically removed from the network, it can no longer reach the Tang server, and the drive stays encrypted, falling back to requiring the passphrase. The convenience only applies while the machine is where it's supposed to be.

## Setting It Up

This assumes a dedicated, low-resource machine for Tang (a Raspberry Pi or small VM works fine) and one or more clients with an existing LUKS-encrypted volume.

**1. Install and enable Tang on the server:**

```bash
sudo apt install tang
sudo systemctl enable --now tangd.socket
```

Tang will start listening on port 80. No further configuration is required - it generates its own signing and exchange keys on first run.

**2. Install Clevis on the client:**

```bash
sudo apt install clevis clevis-luks clevis-initramfs
```

**3. Bind the LUKS volume to the Tang server:**

```bash
# Replace /dev/sdaX with your actual LUKS partition
sudo clevis luks bind -d /dev/sdaX tang '{"url":"http://your-tang-server-ip"}'
```

You'll be asked to confirm the Tang server's advertised key (do this over a channel you trust) and to enter the existing LUKS passphrase once, to authorize the new binding. The original passphrase remains valid as a fallback.

**4. Rebuild the initramfs so Clevis runs at boot:**

```bash
sudo update-initramfs -u
```

From here, a reboot will unlock the volume automatically as long as the client can reach the Tang server.

## Operational Considerations

The convenience of Tang and Clevis shifts the security boundary rather than removing it. The Tang server becomes a sensitive piece of infrastructure, and it's worth treating it accordingly.

**Minimize the Tang server's attack surface.** The server's only required function is answering requests on port 80. There's little reason to leave SSH or other remote-access services running on it. If those services are exploited, an attacker could extract the server's key material and use it to unlock clients offline, without ever touching the client machines. Where possible, restrict administration to a physical console or an out-of-band management interface.

**Encrypt the Tang server's own disk.** If the Tang server's key material is stored on an unencrypted volume, then physical theft of the Tang server alongside a client machine defeats the whole scheme - an attacker could simply power both up together on an isolated network and let them unlock each other. Putting the Tang server behind its own LUKS passphrase closes that gap, at the cost of that one machine needing manual unlocking.

**Back up the Tang keys.** Tang's keys live under `/var/db/tang/` by default. If that directory is lost without a backup, every client bound to it permanently loses its ability to auto-unlock, and each one will need to fall back to its passphrase and be re-bound. Keep an encrypted, offline copy of this directory, and treat restoring it as part of your disaster recovery plan - restoring the same keys lets existing client bindings continue to work without reconfiguration.

## Summary

Tang and Clevis close the gap between "encrypted at rest" and "boots without a human," without handing the keys to a third party. The setup itself takes a few minutes; the part worth taking seriously is hardening and backing up the Tang server, since it now sits at the center of your unlock chain.

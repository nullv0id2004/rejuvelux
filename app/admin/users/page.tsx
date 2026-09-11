/**
 * /admin/users — admin users, roles and invitations (features/admin.md §3,
 * §4, stage 5). Owner only; a staff member who arrives here is told so.
 *
 * Invitations have no email behind them (R-78): the link is shown once, on
 * this page, straight after it is created, and handed over by hand. Changing
 * a role and disabling an account both confirm (§6.3), with the consequence
 * in a sentence. Nothing is deleted: a disabled admin keeps their audit rows.
 */

import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  NotAuthorisedError,
  assertRole,
  requireAdmin,
  requireRole,
  type AdminRole,
  type AdminSession,
} from '@/lib/server/auth/session';
import { explainRefusal } from '@/lib/server/admin/refusal';
import {
  ADMIN_ROLES,
  INVITE_DAYS,
  createInvite,
  listAdminUsers,
  listOpenInvites,
  revokeInvite,
  setAdminRole,
  setAdminStatus,
  signOutAdminEverywhere,
} from '@/lib/server/admin/users';
import { formatDate, formatDateTime } from '../format';
import { backTo, carry, checked, initial, one, prefilled, readNotice, text, type SearchParams } from '../form';
import { ConfirmNotice, Notices, OwnerOnly } from '../notices';
import shell from '../admin.module.css';
import ui from '../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin users' };

const PATH = '/admin/users';

/** The owner gate for actions. A staff POST is sent back with the reason. */
async function owner(): Promise<AdminSession> {
  try {
    return await requireRole('owner');
  } catch (e) {
    if (e instanceof NotAuthorisedError) {
      redirect(backTo('/admin', { refused: 'Only an owner can manage admin users.' }));
    }
    throw e;
  }
}

async function invite(formData: FormData) {
  'use server';
  const session = await owner();
  const carried = carry(formData, ['email', 'role']);
  let created: { id: string; token: string } | null = null;
  let refused: string | null = null;
  try {
    created = await createInvite(session, {
      email: text(formData, 'email'),
      role: text(formData, 'role') as AdminRole,
    });
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  if (refused || !created) redirect(backTo(PATH, { refused: refused ?? undefined, carry: carried }));
  // The plaintext token travels once, to the page that shows the link. It is
  // not stored anywhere; the row holds only its hash.
  redirect(`${PATH}?invited=${created.id}&t=${encodeURIComponent(created.token)}`);
}

async function revoke(formData: FormData) {
  'use server';
  const session = await owner();
  let refused: string | null = null;
  try {
    await revokeInvite(session, text(formData, 'inviteId'));
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  redirect(backTo(PATH, refused ? { refused } : { done: 'Invitation revoked. The link no longer works.' }));
}

async function changeRole(formData: FormData) {
  'use server';
  const session = await owner();
  const target = text(formData, 'target');
  const role = text(formData, 'role') as AdminRole;
  if (!checked(formData, 'confirm')) {
    const q = new URLSearchParams({ confirm: 'role', target, 'f.role': role });
    redirect(`${PATH}?${q.toString()}`);
  }
  let refused: string | null = null;
  try {
    await setAdminRole(session, target, role);
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  redirect(backTo(PATH, refused ? { refused } : { done: `Role changed to ${role}.` }));
}

async function changeStatus(formData: FormData) {
  'use server';
  const session = await owner();
  const target = text(formData, 'target');
  const status = text(formData, 'status') === 'disabled' ? 'disabled' : 'active';
  if (status === 'disabled' && !checked(formData, 'confirm')) {
    const q = new URLSearchParams({ confirm: 'disable', target });
    redirect(`${PATH}?${q.toString()}`);
  }
  let refused: string | null = null;
  try {
    await setAdminStatus(session, target, status);
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  redirect(
    backTo(
      PATH,
      refused
        ? { refused }
        : {
            done:
              status === 'disabled'
                ? 'Account disabled and signed out of the admin everywhere.'
                : 'Account enabled. They can sign in again.',
          }
    )
  );
}

async function signOut(formData: FormData) {
  'use server';
  const session = await owner();
  let refused: string | null = null;
  let n = 0;
  try {
    n = await signOutAdminEverywhere(session, text(formData, 'target'));
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  redirect(
    backTo(
      PATH,
      refused
        ? { refused }
        : { done: `Signed out of the admin everywhere: ${n} session${n === 1 ? '' : 's'} ended.` }
    )
  );
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireAdmin();
  try {
    assertRole(session, 'owner');
  } catch {
    return (
      <>
        <h1 className={shell.pageTitle}>Admin users</h1>
        <OwnerOnly />
      </>
    );
  }

  const sp = await searchParams;
  const notice = readNotice(sp);
  const [users, invites] = await Promise.all([listAdminUsers(), listOpenInvites()]);

  const invitedId = one(sp, 'invited');
  const token = one(sp, 't');
  const invited = invitedId ? invites.find((i) => i.id === invitedId) : undefined;
  let inviteLink: string | null = null;
  if (invited && token) {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
    const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
    inviteLink = `${proto}://${host}/admin/invite/${token}`;
  }

  const confirmKind = notice.confirm ? one(sp, 'confirm') : undefined;
  const confirmTarget = confirmKind ? users.find((u) => u.id === one(sp, 'target')) : undefined;
  const confirmRole = prefilled(sp, 'role') as AdminRole | undefined;

  return (
    <>
      <h1 className={shell.pageTitle}>Admin users</h1>
      <p className={shell.pageIntro}>
        Who can sign in here, and what they may do. <strong>Owners</strong> can
        do everything, including this page. <strong>Staff</strong> can do
        everything else: products, prices, stock, orders, customers. Nobody is
        deleted; an account is disabled and its history stays.
      </p>

      <Notices notice={notice} />

      {inviteLink && invited ? (
        <div className={`${ui.notice} ${ui.noticeDone}`} role="status">
          <strong>Invitation created for {invited.email}</strong> as {invited.role}. There is no
          invitation email, so copy this link and send it to them yourself. It is shown once,
          works once, and expires on {formatDate(invited.expiresAt)}.
          <pre className={ui.code} style={{ marginTop: 10 }}>{inviteLink}</pre>
        </div>
      ) : null}

      {confirmKind === 'role' && confirmTarget && confirmRole ? (
        <form action={changeRole}>
          <input type="hidden" name="target" value={confirmTarget.id} />
          <input type="hidden" name="role" value={confirmRole} />
          <input type="hidden" name="confirm" value="1" />
          <ConfirmNotice>
            {confirmRole === 'owner' ? (
              <>
                Make <strong>{confirmTarget.email}</strong> an owner? Owners can invite and remove
                admin users and change roles, including yours.
              </>
            ) : (
              <>
                Make <strong>{confirmTarget.email}</strong> staff? They keep every operational
                page and lose the ability to manage admin users.
              </>
            )}{' '}
            <button className={`${ui.secondary} ${ui.small}`} type="submit">
              Yes, change the role
            </button>{' '}
            <Link className={ui.link} href={PATH}>
              Cancel
            </Link>
          </ConfirmNotice>
        </form>
      ) : null}

      {confirmKind === 'disable' && confirmTarget ? (
        <form action={changeStatus}>
          <input type="hidden" name="target" value={confirmTarget.id} />
          <input type="hidden" name="status" value="disabled" />
          <input type="hidden" name="confirm" value="1" />
          <ConfirmNotice>
            Disable <strong>{confirmTarget.email}</strong>? They are signed out of the admin at
            once and cannot sign in until enabled again. Everything they did stays in the audit
            log.{' '}
            <button className={`${ui.secondary} ${ui.small}`} type="submit">
              Yes, disable
            </button>{' '}
            <Link className={ui.link} href={PATH}>
              Cancel
            </Link>
          </ConfirmNotice>
        </form>
      ) : null}

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>People</h2>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th scope="col">Person</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Last sign-in</th>
                <th scope="col">
                  <span className={ui.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const me = u.id === session.adminUserId;
                return (
                  <tr key={u.id}>
                    <td>
                      <span className={ui.primaryCell}>{u.name ?? u.email}</span>
                      <span className={ui.sub}>
                        {u.email}
                        {me ? ' · you' : ''}
                      </span>
                    </td>
                    <td>
                      <form className={ui.inline} action={changeRole}>
                        <input type="hidden" name="target" value={u.id} />
                        <label className={ui.srOnly} htmlFor={`role-${u.id}`}>
                          Role for {u.email}
                        </label>
                        <select id={`role-${u.id}`} className={ui.select} name="role" defaultValue={u.role}>
                          {ADMIN_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <button className={`${ui.secondary} ${ui.small}`} type="submit">
                          Change
                        </button>
                      </form>
                    </td>
                    <td>
                      <span className={`${ui.badge} ${u.status === 'active' ? ui.badgeStrong : ''}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className={ui.muted}>
                      {u.lastSignInAt ? formatDateTime(u.lastSignInAt) : 'Never'}
                    </td>
                    <td className={ui.rowActions}>
                      {u.status === 'active' ? (
                        <>
                          <form className={ui.inline} action={signOut}>
                            <input type="hidden" name="target" value={u.id} />
                            <button className={ui.link} type="submit">
                              Sign out everywhere
                            </button>
                          </form>
                          {!me ? (
                            <form className={ui.inline} action={changeStatus}>
                              <input type="hidden" name="target" value={u.id} />
                              <input type="hidden" name="status" value="disabled" />
                              <button className={ui.link} type="submit">
                                Disable
                              </button>
                            </form>
                          ) : null}
                        </>
                      ) : (
                        <form className={ui.inline} action={changeStatus}>
                          <input type="hidden" name="target" value={u.id} />
                          <input type="hidden" name="status" value="active" />
                          <button className={ui.link} type="submit">
                            Enable
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Invite someone</h2>
        <form className={ui.form} action={invite}>
          <div className={ui.fieldRow}>
            <label className={ui.field}>
              <span className={ui.label}>Email address</span>
              <span className={ui.hint}>They sign in with this address.</span>
              <input className={ui.input} type="email" name="email" required maxLength={120} defaultValue={initial(sp, 'email', '')} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Role</span>
              <span className={ui.hint}>Staff, unless they will manage other admins.</span>
              <select className={ui.select} name="role" defaultValue={initial(sp, 'role', 'staff')}>
                {ADMIN_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={ui.actions}>
            <button className={ui.primary} type="submit">
              Create invitation link
            </button>
          </div>
        </form>
        <p className={ui.footnote} style={{ marginTop: 12 }}>
          The link is valid for {INVITE_DAYS} days and can be used once. The person chooses their own
          password when they open it; if they already have an account on the shop with the same
          address, they sign in with that password instead.
        </p>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Open invitations</h2>
        {invites.length === 0 ? (
          <p className={ui.muted} style={{ margin: 0 }}>None.</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Invited by</th>
                  <th scope="col">Expires</th>
                  <th scope="col">
                    <span className={ui.srOnly}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invites.map((i) => (
                  <tr key={i.id}>
                    <td className={ui.primaryCell}>{i.email}</td>
                    <td>{i.role}</td>
                    <td className={ui.muted}>{i.invitedByEmail}</td>
                    <td className={ui.muted}>{formatDate(i.expiresAt)}</td>
                    <td className={ui.rowActions}>
                      <form className={ui.inline} action={revoke}>
                        <input type="hidden" name="inviteId" value={i.id} />
                        <button className={ui.link} type="submit">
                          Revoke
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

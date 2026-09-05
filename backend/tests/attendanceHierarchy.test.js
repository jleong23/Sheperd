const test = require('node:test');
const assert = require('node:assert/strict');
const { getManagedLeaderIds, getVisibleTermOwners } = require('../lib/attendanceHierarchy');

function createSupabaseStub() {
  const usersByLeaderId = {
    'pastor-1': { role: 'pastor', leader_id: 'pastor-1' },
    'leader-1': { role: 'leader', leader_id: 'leader-1' },
    'leader-2': { role: 'leader', leader_id: 'leader-2' }
  };

  const descendantsByParent = {
    'pastor-1': [{ leader_id: 'leader-1' }],
    'leader-1': [{ leader_id: 'leader-2' }],
    'leader-2': []
  };

  return {
    from(table) {
      assert.equal(table, 'users');

      return {
        select() {
          return {
            eq(column, value) {
              if (column === 'leader_id') {
                return {
                  async single() {
                    return { data: usersByLeaderId[value] ?? null, error: null };
                  }
                };
              }

              return {
                data: descendantsByParent[value] ?? [],
                error: null
              };
            }
          };
        }
      };
    }
  };
}

test('getManagedLeaderIds returns the pastor and all descendant leaders', async () => {
  const supabase = createSupabaseStub();

  const managedIds = await getManagedLeaderIds(supabase, 'pastor-1');

  assert.deepEqual(managedIds.sort(), ['pastor-1', 'leader-1', 'leader-2'].sort());
});

test('getVisibleTermOwners returns the same recursive hierarchy for term visibility', async () => {
  const supabase = createSupabaseStub();

  const visibleOwners = await getVisibleTermOwners(supabase, 'pastor-1');

  assert.deepEqual(visibleOwners.sort(), ['pastor-1', 'leader-1', 'leader-2'].sort());
});

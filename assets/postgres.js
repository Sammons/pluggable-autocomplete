/** Contributed by Ben Sammons */

var knex = require("knex");

let conn = knex({
  client: "postgresql",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "secret",
    database: "postgres"
  }
});

exports.name = "tbl";
exports.resolveItems = shouldStopEarly => {
  console.log('invoked')
  return conn.raw(
      `
select
	coalesce(
		pg_catalog.col_description(
			c.oid,
			col.ordinal_position
		),
		'no comment'
	) as comment,
	col.table_schema,
	c.relname as table_name,
	a.attname as column_name,
	pg_catalog.format_type(
		a.atttypid,
		a.atttypmod
	) as type,
	case
		when a.attnotnull then 'not nullable'
		else 'nullable'
	end as nullable
from
	pg_class c,
	pg_attribute a,
	pg_type t,
	information_schema.columns col
where
	c.relkind = 'r'
	and a.attnum > 0
	and a.attrelid = c.oid
	and a.atttypid = t.oid
	and relname in(
		select
			distinct table_name
		from
			information_schema.tables t
		where
			t.table_schema not in ('pg_catalog', 'information_schema')
	)
	and table_name = c.relname
	and column_name = a.attname
order by
	table_name DESC, col.ordinal_position ASC;
`
    )
    .then(result => {
      if (result && result.rows) {
        return result.rows.map(r => ({
          prefix: r.table_schema + "." + r.table_name,
          value: r.column_name,
          sortToken: r.schema + r.table + r.ordinal_position,
          comment: r.type + " - " + r.nullable + " - " + r.comment
        }));
      } else {
        return [];
      }
    })
    .catch(e => {
      console.log(e);
      throw e; 
    });
};
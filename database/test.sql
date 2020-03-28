select * from `titles` 
where
    `adult` = 0 and
    `is_series` = 0 and
    exists (
        select * from `tags`
        inner join `taggables`
        on `tags`.`id` = `taggables`.`tag_id`
        where
            `titles`.`id` = `taggables`.`taggable_id` and
            `name` in ('animovany', 'komedia') and
            `tags`.`type` = 'genre'
    )
order by `popularity` desc
limit 16
offset 0


TITLES
id = 

TAGGABLES
taggable_type = "App\Title"
taggable_id
tag_id

TAGS
id
name = 
type = "genre"

SELECT * FROM `titles`
INNER JOIN `taggables` ON `titles`.`id` = `taggables`.`taggable_id`
INNER JOIN `tags` ON `tags`.`id` = `taggables`.`tag_id`
WHERE `tags`.`name` = "animovany" OR `tags`.`name` = "komedia"

select * from `titles`
inner join `taggables` on `titles`.`id` = `taggables`.`taggable_id`
inner join `tags` on `tags`.`id` = `taggables`.`tag_id`
where `adult` = ? and `is_series` = ? and `tags`.`name` = ? or `tags`.`name` = ? order by `popularity` desc limit 16 offset 0 [, , animovany, komedia]
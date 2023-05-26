-- @block init band_search
drop table band_search;
create virtual table band_search using fts5(name, members);

INSERT INTO band_search(rowid, name, members)
SELECT band.id, band.name, group_concat(person.name)
FROM band
JOIN band_member ON band.id = band_member.band_id
JOIN person ON band_member.member_id = person.id
GROUP BY band.id;


-- @block select nett
select * from band_search where name match 'as*' order by rank;



-- @block init band_search alternate
drop table band_search;
create virtual table band_search using fts5(name, members);

INSERT INTO band_search(rowid, name, members)
SELECT band.id, band.name, group_concat(allppl.name)--group_concat(person.name)
FROM band
JOIN band_member ON band.id = band_member.band_id
JOIN person ON band_member.member_id = person.id
join person as allppl
where allppl.name like "S%"
GROUP BY band.id;



-- @block init venue_search
drop table venue_search;
create virtual table venue_search using fts5(name, shows);

INSERT INTO venue_search(rowid, name, shows)
SELECT venue.id, venue.name, group_concat(concat(video.url,show.date))
FROM venue
JOIN show ON show.venue_id = venue.id
JOIN video ON video.show_id = show.id
GROUP BY venue.id;

-- @block
select * from sqlite_master where type ="table"

-- @block
SELECT venue.id, venue_name, count(show.id) as show_count, group_concat(band.name || " @ " || venue.venue_name || " - " || show.date || ". http://youtube.com/watch?v=" || video.url) as shows
FROM venue
JOIN show ON show.venue_id = venue.id
JOIN video ON video.show_id = show.id
JOIN band ON video.band_id = band.id
GROUP BY venue.id;


-- @block
SELECT 
venue.id, 
venue_name,
"http://youtube.com/watch?v=" || video.url as video_url,
"https://img.youtube.com/vi/" || video.url || "/0.jpg" as thumbnail,
show.date as date,
band.name as band
FROM venue
JOIN show ON show.venue_id = venue.id
JOIN video ON video.show_id = show.id
JOIN band ON video.band_id = band.id
GROUP BY venue.id; 



-- @block
SELECT 
venue.id, 
venue_name,
"http://youtube.com/watch?v=" || video.url as video_url,
"https://img.youtube.com/vi/" || video.url || "/0.jpg" as thumbnail,
show.date as date,
band.name as band
FROM show
JOIN venue ON show.venue_id = venue.id
JOIN video ON video.show_id = show.id
JOIN band ON video.band_id = band.id
WHERE band.name LIKE "%%"
GROUP BY show.id; 




-- @block init venue_search
drop table video_search;
create virtual table video_search using fts5(band,date,venue_name,members,thumbnail,video_url);

INSERT INTO video_search(rowid, band, date, venue_name, members, thumbnail,video_url)
SELECT video.id, band.name, show.date, venue.venue_name, group_concat(person.name) as members, "https://img.youtube.com/vi/" || video.url || "/0.jpg" as thumbnail, "http://youtube.com/watch?v=" || video.url as video_url
FROM video
JOIN show ON video.show_id = show.id
JOIN band ON video.band_id = band.id
JOIN venue ON show.venue_id = venue.id
JOIN band_member ON band_member.band_id = band.id
JOIN person ON band_member.member_id = person.id
GROUP BY video.id;


-- @block search video_search
select * from video_search where video_search match "ægir*" order by rank, date
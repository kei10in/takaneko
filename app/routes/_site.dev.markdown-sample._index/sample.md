# Markdown Styling Combination Fixture

このドキュメントは、Markdown を HTML にレンダリングしたときの **要素同士の前後関係** を確認するためのスタイリングチェック用 fixture です。

---

# Baseline

これは H1 の直後にある通常段落です。H1 下の余白、本文との距離、行間を確認します。

## Baseline H2

これは H2 の直後にある通常段落です。

### Baseline H3

これは H3 の直後にある通常段落です。

#### Baseline H4

これは H4 の直後にある通常段落です。

##### Baseline H5

これは H5 の直後にある通常段落です。

###### Baseline H6

これは H6 の直後にある通常段落です。

---

# H1 followed by Unordered list

- Unordered list item A
- Unordered list item B

## H2 followed by Unordered list

- Unordered list item A
- Unordered list item B

### H3 followed by Unordered list

- Unordered list item A
- Unordered list item B

#### H4 followed by Unordered list

- Unordered list item A
- Unordered list item B

##### H5 followed by Unordered list

- Unordered list item A
- Unordered list item B

###### H6 followed by Unordered list

- Unordered list item A
- Unordered list item B

---

# H1 followed by Ordered list

1. Ordered list item A
1. Ordered list item B

## H2 followed by Ordered list

1. Ordered list item A
1. Ordered list item B

### H3 followed by Ordered list

1. Ordered list item A
1. Ordered list item B

#### H4 followed by Ordered list

1. Ordered list item A
1. Ordered list item B

##### H5 followed by Ordered list

1. Ordered list item A
1. Ordered list item B

###### H6 followed by Ordered list

1. Ordered list item A
1. Ordered list item B

---

# H1 followed by Task list

- [x] Task list item A
- [ ] Task list item B

## H2 followed by Task list

- [x] Task list item A
- [ ] Task list item B

### H3 followed by Task list

- [x] Task list item A
- [ ] Task list item B

#### H4 followed by Task list

- [x] Task list item A
- [ ] Task list item B

##### H5 followed by Task list

- [x] Task list item A
- [ ] Task list item B

###### H6 followed by Task list

- [x] Task list item A
- [ ] Task list item B

---

# Blockquote followed by H1

> Heading 直後の blockquote です。
> 見出し下の余白と引用の上余白が合成されたときの見た目を確認します。

## Blockquote followed by H2

> Heading 直後の blockquote です。
> 見出し下の余白と引用の上余白が合成されたときの見た目を確認します。

### Blockquote followed by H3

> Heading 直後の blockquote です。
> 見出し下の余白と引用の上余白が合成されたときの見た目を確認します。

#### Blockquote followed by H4

> Heading 直後の blockquote です。
> 見出し下の余白と引用の上余白が合成されたときの見た目を確認します。

##### Blockquote followed by H5

> Heading 直後の blockquote です。
> 見出し下の余白と引用の上余白が合成されたときの見た目を確認します。

###### Blockquote followed by H6

> Heading 直後の blockquote です。
> 見出し下の余白と引用の上余白が合成されたときの見た目を確認します。

---

# Code block followed by H1

```js
function afterH1() {
  return "code block immediately after h1";
}
```

## Code block followed by H2

```js
function afterH2() {
  return "code block immediately after h2";
}
```

### Code block followed by H3

```js
function afterH3() {
  return "code block immediately after h3";
}
```

#### Code block followed by H4

```js
function afterH4() {
  return "code block immediately after h4";
}
```

##### Code block followed by H5

```js
function afterH5() {
  return "code block immediately after h5";
}
```

###### Code block followed by H6

```js
function afterH6() {
  return "code block immediately after h6";
}
```

---

# Table followed by H1

| Item | Value                |
| ---- | -------------------- |
| A    | Heading 直後の table |
| B    | spacing check        |

## H2 followed by table

| Item | Value                |
| ---- | -------------------- |
| A    | Heading 直後の table |
| B    | spacing check        |

### H3 followed by table

| Item | Value                |
| ---- | -------------------- |
| A    | Heading 直後の table |
| B    | spacing check        |

#### H4 followed by table

| Item | Value                |
| ---- | -------------------- |
| A    | Heading 直後の table |
| B    | spacing check        |

##### H5 followed by table

| Item | Value                |
| ---- | -------------------- |
| A    | Heading 直後の table |
| B    | spacing check        |

###### H6 followed by table

| Item | Value                |
| ---- | -------------------- |
| A    | Heading 直後の table |
| B    | spacing check        |

---

# H1 followed by image

![H1 followed by image](/takanekono-card-schedule.png)

## H2 followed by image

![H2 followed by image](/takanekono-card-schedule.png)

### H3 followed by image

![H3 followed by image](/takanekono-card-schedule.png)

#### H4 followed by image

![H4 followed by image](/takanekono-card-schedule.png)

##### H5 followed by image

![H5 followed by image](/takanekono-card-schedule.png)

###### H6 followed by image

![H6 followed by image](/takanekono-card-schedule.png)

---

# Heading-to-heading combinations

## H2 followed immediately by H3

### H3 immediately after H2

#### H4 immediately after H3

##### H5 immediately after H4

###### H6 immediately after H5

---

## Unordered list

### Tight unordered list

- tight item A
- tight item B
- tight item C

### Loose unordered list

- loose item A

- loose item B

- loose item C

### Nested unordered list

- Level 1 item A
  - Level 2 item A
  - Level 2 item B
    - Level 3 item A
      - Level 4 item A
  - Level 2 item C

### Unordered list containing block elements

- list item A

  paragraph inside list after H2.

- list item A

  ![image inside list](/takanekono-card-schedule.png)

- list item B

  > blockquote inside list after H2.
  > indent と引用スタイルを確認します。

- list item C の本文です。

  ```js
  console.log("code inside list after h2");
  ```

## Ordered list

### Tight ordered list

1. tight ordered item A
2. tight ordered item B
3. tight ordered item C

### Loose ordered list

1. loose ordered item A

2. loose ordered item B

3. loose ordered item C

### Nested ordered list

1. Level 1 item A
   1. Level 2 item A
   1. Level 2 item B
      1. Level 3 item A
         1. Level 4 item A
   1. Level 2 item C

### Ordered list containing block elements

1. list item A

   paragraph inside list after H2.

1. list item A

   ![image inside list](/takanekono-card-schedule.png)

1. list item B

   > blockquote inside list after H2.
   > indent と引用スタイルを確認します。

1. list item C の本文です。

   ```js
   console.log("code inside list after h2");
   ```

---

## Task list

### Tight task list

- [x] tight task item A
- [ ] tight task item B
- [ ] tight task item C

### Loose task list

- [x] loose task item A

- [ ] loose task item B

- [ ] loose task item C

---

## Inline elements in every major block

これは **bold**、_italic_、**_bold italic_**、`inline code`、~~strikethrough~~、[link](https://example.com) を含む paragraph です。

- **bold** in unordered list
- _italic_ in unordered list
- `inline code` in unordered list
- [link](https://example.com) in unordered list
- 長い list item の中に **bold**、`inline code`、[link](https://example.com) が入っています。折り返し時の indent を確認します。

1. **bold** in ordered list
2. _italic_ in ordered list
3. `inline code` in ordered list
4. [link](https://example.com) in ordered list
5. 長い ordered item の中に **bold**、`inline code`、[link](https://example.com) が入っています。

> **bold**、_italic_、`inline code`、[link](https://example.com) を含む blockquote です。
> 日本語の中に**太字**や`code`が入るケースです。

| Type   | Example                                             |
| ------ | --------------------------------------------------- |
| Bold   | **bold text**                                       |
| Italic | _italic text_                                       |
| Code   | `inline code`                                       |
| Link   | [example](https://example.com)                      |
| Mixed  | **bold** and `code` and [link](https://example.com) |

## Long paragraph

これは非常に長い paragraph です。Markdown を HTML にレンダリングしたとき、本文の最大幅、行間、文字間、折り返し位置、句読点の扱い、英単語と日本語の混在、インライン要素の挿入位置などを確認します。特にドキュメントやブログ記事では、本文幅が広すぎると読みづらくなり、狭すぎると改行が多くなりすぎます。This sentence also includes English text so that mixed-language wrapping can be checked together with Japanese text.

aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

```txt
this-is-a-very-long-code-line-without-spaces-to-check-horizontal-scroll-and-overflow-behavior-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

## Wide table

| Column 1          | Column 2          | Column 3          | Column 4          | Column 5          | Column 6          | Column 7          | Column 8          |
| ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- |
| Very long value 1 | Very long value 2 | Very long value 3 | Very long value 4 | Very long value 5 | Very long value 6 | Very long value 7 | Very long value 8 |
| A                 | B                 | C                 | D                 | E                 | F                 | G                 | H                 |

wide table の直後にある paragraph です。

## Table with long cell

| Item   | Description                                                                                                                                           |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Short  | 短い説明です。                                                                                                                                        |
| Long   | これは非常に長いセルの内容です。表の中でテキストが折り返されたとき、セル内の padding、line-height、縦方向の揃い、列幅のバランスが自然かを確認します。 |
| Inline | **bold**、`code`、[link](https://example.com) を含むセルです。                                                                                        |

table の直後にある paragraph です。

## Footnotes

Some sentence [^note]

[^note]: This is a footnote. It should be rendered at the end of the document, and the footnote reference in the text should link to this content.

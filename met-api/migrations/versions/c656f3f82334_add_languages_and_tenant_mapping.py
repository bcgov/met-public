"""
Add the list of supported languages and create a table to map them to tenants when selected.

Revision ID: c656f3f82334
Revises: 22fb6b5b5aed
Create Date: 2024-05-28 15:45:56.151488

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c656f3f82334'
down_revision = '22fb6b5b5aed'
branch_labels = None
depends_on = None

language_data = [
    {
      "language": "Abkhazian",
      "iso_code": "ab"
    },
    {
      "language": "Afar",
      "iso_code": "aa"
    },
    {
      "language": "Afrikaans",
      "iso_code": "af"
    },
    {
      "language": "Akan",
      "iso_code": "ak"
    },
    {
      "language": "Albanian",
      "iso_code": "sq"
    },
    {
      "language": "Amharic",
      "iso_code": "am"
    },
    {
      "language": "Arabic",
      "iso_code": "ar"
    },
    {
      "language": "Aragonese",
      "iso_code": "an"
    },
    {
      "language": "Armenian",
      "iso_code": "hy"
    },
    {
      "language": "Assamese",
      "iso_code": "as"
    },
    {
      "language": "Avaric",
      "iso_code": "av"
    },
    {
      "language": "Avestan",
      "iso_code": "ae"
    },
    {
      "language": "Aymara",
      "iso_code": "ay"
    },
    {
      "language": "Azerbaijani",
      "iso_code": "az"
    },
    {
      "language": "Bambara",
      "iso_code": "bm"
    },
    {
      "language": "Bashkir",
      "iso_code": "ba"
    },
    {
      "language": "Basque",
      "iso_code": "eu"
    },
    {
      "language": "Belarusian",
      "iso_code": "be"
    },
    {
      "language": "Bengali (Bangla)",
      "iso_code": "bn"
    },
    {
      "language": "Bihari",
      "iso_code": "bh"
    },
    {
      "language": "Bislama",
      "iso_code": "bi"
    },
    {
      "language": "Bosnian",
      "iso_code": "bs"
    },
    {
      "language": "Breton",
      "iso_code": "br"
    },
    {
      "language": "Bulgarian",
      "iso_code": "bg"
    },
    {
      "language": "Burmese",
      "iso_code": "my"
    },
    {
      "language": "Catalan",
      "iso_code": "ca"
    },
    {
      "language": "Chamorro",
      "iso_code": "ch"
    },
    {
      "language": "Chechen",
      "iso_code": "ce"
    },
    {
      "language": "Chichewa, Chewa, Nyanja",
      "iso_code": "ny"
    },
    {
      "language": "Chinese",
      "iso_code": "zh"
    },
    {
      "language": "Chinese (Simplified)",
      "iso_code": "zh-Hans"
    },
    {
      "language": "Chinese (Traditional)",
      "iso_code": "zh-Hant"
    },
    {
      "language": "Chuvash",
      "iso_code": "cv"
    },
    {
      "language": "Cornish",
      "iso_code": "kw"
    },
    {
      "language": "Corsican",
      "iso_code": "co"
    },
    {
      "language": "Cree",
      "iso_code": "cr"
    },
    {
      "language": "Croatian",
      "iso_code": "hr"
    },
    {
      "language": "Czech",
      "iso_code": "cs"
    },
    {
      "language": "Danish",
      "iso_code": "da"
    },
    {
      "language": "Divehi, Dhivehi, Maldivian",
      "iso_code": "dv"
    },
    {
      "language": "Dutch",
      "iso_code": "nl"
    },
    {
      "language": "Dzongkha",
      "iso_code": "dz"
    },
    {
      "language": "English",
      "iso_code": "en"
    },
    {
      "language": "Esperanto",
      "iso_code": "eo"
    },
    {
      "language": "Estonian",
      "iso_code": "et"
    },
    {
      "language": "Ewe",
      "iso_code": "ee"
    },
    {
      "language": "Faroese",
      "iso_code": "fo"
    },
    {
      "language": "Fijian",
      "iso_code": "fj"
    },
    {
      "language": "Finnish",
      "iso_code": "fi"
    },
    {
      "language": "French",
      "iso_code": "fr"
    },
    {
      "language": "Fula, Fulah, Pulaar, Pular",
      "iso_code": "ff"
    },
    {
      "language": "Galician",
      "iso_code": "gl"
    },
    {
      "language": "Gaelic (Scottish)",
      "iso_code": "gd"
    },
    {
      "language": "Georgian",
      "iso_code": "ka"
    },
    {
      "language": "German",
      "iso_code": "de"
    },
    {
      "language": "Greek",
      "iso_code": "el"
    },
    {
      "language": "Guarani",
      "iso_code": "gn"
    },
    {
      "language": "Gujarati",
      "iso_code": "gu"
    },
    {
      "language": "Haitian Creole",
      "iso_code": "ht"
    },
    {
      "language": "Hausa",
      "iso_code": "ha"
    },
    {
      "language": "Hebrew",
      "iso_code": "he"
    },
    {
      "language": "Herero",
      "iso_code": "hz"
    },
    {
      "language": "Hindi",
      "iso_code": "hi"
    },
    {
      "language": "Hiri Motu",
      "iso_code": "ho"
    },
    {
      "language": "Hungarian",
      "iso_code": "hu"
    },
    {
      "language": "Icelandic",
      "iso_code": "is"
    },
    {
      "language": "Ido",
      "iso_code": "io"
    },
    {
      "language": "Igbo",
      "iso_code": "ig"
    },
    {
      "language": "Indonesian",
      "iso_code": "id"
    },
    {
      "language": "Interlingua",
      "iso_code": "ia"
    },
    {
      "language": "Interlingue",
      "iso_code": "ie"
    },
    {
      "language": "Inuktitut",
      "iso_code": "iu"
    },
    {
      "language": "Inupiak",
      "iso_code": "ik"
    },
    {
      "language": "Irish",
      "iso_code": "ga"
    },
    {
      "language": "Italian",
      "iso_code": "it"
    },
    {
      "language": "Japanese",
      "iso_code": "ja"
    },
    {
      "language": "Javanese",
      "iso_code": "jv"
    },
    {
      "language": "Kalaallisut, Greenlandic",
      "iso_code": "kl"
    },
    {
      "language": "Kannada",
      "iso_code": "kn"
    },
    {
      "language": "Kanuri",
      "iso_code": "kr"
    },
    {
      "language": "Kashmiri",
      "iso_code": "ks"
    },
    {
      "language": "Kazakh",
      "iso_code": "kk"
    },
    {
      "language": "Khmer",
      "iso_code": "km"
    },
    {
      "language": "Kikuyu",
      "iso_code": "ki"
    },
    {
      "language": "Kinyarwanda (Rwanda)",
      "iso_code": "rw"
    },
    {
      "language": "Kirundi",
      "iso_code": "rn"
    },
    {
      "language": "Kyrgyz",
      "iso_code": "ky"
    },
    {
      "language": "Komi",
      "iso_code": "kv"
    },
    {
      "language": "Kongo",
      "iso_code": "kg"
    },
    {
      "language": "Korean",
      "iso_code": "ko"
    },
    {
      "language": "Kurdish",
      "iso_code": "ku"
    },
    {
      "language": "Kwanyama",
      "iso_code": "kj"
    },
    {
      "language": "Lao",
      "iso_code": "lo"
    },
    {
      "language": "Latin",
      "iso_code": "la"
    },
    {
      "language": "Latvian (Lettish)",
      "iso_code": "lv"
    },
    {
      "language": "Limburgish ( Limburger)",
      "iso_code": "li"
    },
    {
      "language": "Lingala",
      "iso_code": "ln"
    },
    {
      "language": "Lithuanian",
      "iso_code": "lt"
    },
    {
      "language": "Luga-Katanga",
      "iso_code": "lu"
    },
    {
      "language": "Luganda, Ganda",
      "iso_code": "lg"
    },
    {
      "language": "Luxembourgish",
      "iso_code": "lb"
    },
    {
      "language": "Manx",
      "iso_code": "gv"
    },
    {
      "language": "Macedonian",
      "iso_code": "mk"
    },
    {
      "language": "Malagasy",
      "iso_code": "mg"
    },
    {
      "language": "Malay",
      "iso_code": "ms"
    },
    {
      "language": "Malayalam",
      "iso_code": "ml"
    },
    {
      "language": "Maltese",
      "iso_code": "mt"
    },
    {
      "language": "Maori",
      "iso_code": "mi"
    },
    {
      "language": "Marathi",
      "iso_code": "mr"
    },
    {
      "language": "Marshallese",
      "iso_code": "mh"
    },
    {
      "language": "Moldavian",
      "iso_code": "mo"
    },
    {
      "language": "Mongolian",
      "iso_code": "mn"
    },
    {
      "language": "Nauru",
      "iso_code": "na"
    },
    {
      "language": "Navajo",
      "iso_code": "nv"
    },
    {
      "language": "Ndonga",
      "iso_code": "ng"
    },
    {
      "language": "Northern Ndebele",
      "iso_code": "nd"
    },
    {
      "language": "Nepali",
      "iso_code": "ne"
    },
    {
      "language": "Norwegian",
      "iso_code": "no"
    },
    {
      "language": "Norwegian bokmål",
      "iso_code": "nb"
    },
    {
      "language": "Norwegian nynorsk",
      "iso_code": "nn"
    },
    {
      "language": "Occitan",
      "iso_code": "oc"
    },
    {
      "language": "Ojibwe",
      "iso_code": "oj"
    },
    {
      "language": "Old Church Slavonic, Old Bulgarian",
      "iso_code": "cu"
    },
    {
      "language": "Oriya",
      "iso_code": "or"
    },
    {
      "language": "Oromo (Afaan Oromo)",
      "iso_code": "om"
    },
    {
      "language": "Ossetian",
      "iso_code": "os"
    },
    {
      "language": "Pāli",
      "iso_code": "pi"
    },
    {
      "language": "Pashto, Pushto",
      "iso_code": "ps"
    },
    {
      "language": "Persian (Farsi)",
      "iso_code": "fa"
    },
    {
      "language": "Polish",
      "iso_code": "pl"
    },
    {
      "language": "Portuguese",
      "iso_code": "pt"
    },
    {
      "language": "Punjabi (Eastern)",
      "iso_code": "pa"
    },
    {
      "language": "Quechua",
      "iso_code": "qu"
    },
    {
      "language": "Romansh",
      "iso_code": "rm"
    },
    {
      "language": "Romanian",
      "iso_code": "ro"
    },
    {
      "language": "Russian",
      "iso_code": "ru"
    },
    {
      "language": "Sami",
      "iso_code": "se"
    },
    {
      "language": "Samoan",
      "iso_code": "sm"
    },
    {
      "language": "Sango",
      "iso_code": "sg"
    },
    {
      "language": "Sanskrit",
      "iso_code": "sa"
    },
    {
      "language": "Serbian",
      "iso_code": "sr"
    },
    {
      "language": "Serbo-Croatian",
      "iso_code": "sh"
    },
    {
      "language": "Sesotho",
      "iso_code": "st"
    },
    {
      "language": "Setswana",
      "iso_code": "tn"
    },
    {
      "language": "Shona",
      "iso_code": "sn"
    },
    {
      "language": "Sichuan Yi, Nuosu",
      "iso_code": "ii"
    },
    {
      "language": "Sindhi",
      "iso_code": "sd"
    },
    {
      "language": "Sinhalese",
      "iso_code": "si"
    },
    {
      "language": "Slovak",
      "iso_code": "sk"
    },
    {
      "language": "Slovenian",
      "iso_code": "sl"
    },
    {
      "language": "Somali",
      "iso_code": "so"
    },
    {
      "language": "Southern Ndebele",
      "iso_code": "nr"
    },
    {
      "language": "Spanish",
      "iso_code": "es"
    },
    {
      "language": "Sundanese",
      "iso_code": "su"
    },
    {
      "language": "Swahili (Kiswahili)",
      "iso_code": "sw"
    },
    {
      "language": "Swati",
      "iso_code": "ss"
    },
    {
      "language": "Swedish",
      "iso_code": "sv"
    },
    {
      "language": "Tagalog",
      "iso_code": "tl"
    },
    {
      "language": "Tahitian",
      "iso_code": "ty"
    },
    {
      "language": "Tajik",
      "iso_code": "tg"
    },
    {
      "language": "Tamil",
      "iso_code": "ta"
    },
    {
      "language": "Tatar",
      "iso_code": "tt"
    },
    {
      "language": "Telugu",
      "iso_code": "te"
    },
    {
      "language": "Thai",
      "iso_code": "th"
    },
    {
      "language": "Tibetan",
      "iso_code": "bo"
    },
    {
      "language": "Tigrinya",
      "iso_code": "ti"
    },
    {
      "language": "Tonga",
      "iso_code": "to"
    },
    {
      "language": "Tsonga",
      "iso_code": "ts"
    },
    {
      "language": "Turkish",
      "iso_code": "tr"
    },
    {
      "language": "Turkmen",
      "iso_code": "tk"
    },
    {
      "language": "Twi",
      "iso_code": "tw"
    },
    {
      "language": "Uyghur",
      "iso_code": "ug"
    },
    {
      "language": "Ukrainian",
      "iso_code": "uk"
    },
    {
      "language": "Urdu",
      "iso_code": "ur"
    },
    {
      "language": "Uzbek",
      "iso_code": "uz"
    },
    {
      "language": "Venda",
      "iso_code": "ve"
    },
    {
      "language": "Vietnamese",
      "iso_code": "vi"
    },
    {
      "language": "Volapük",
      "iso_code": "vo"
    },
    {
      "language": "Wallon",
      "iso_code": "wa"
    },
    {
      "language": "Welsh",
      "iso_code": "cy"
    },
    {
      "language": "Wolof",
      "iso_code": "wo"
    },
    {
      "language": "Western Frisian",
      "iso_code": "fy"
    },
    {
      "language": "Xhosa",
      "iso_code": "xh"
    },
    {
      "language": "Yiddish",
      "iso_code": "yi"
    },
    {
      "language": "Yoruba",
      "iso_code": "yo"
    },
    {
      "language": "Zhuang, Chuang",
      "iso_code": "za"
    },
    {
      "language": "Zulu",
      "iso_code": "zu"
    }
]

def upgrade():
    for index, value in enumerate(language_data):
        op.execute("INSERT INTO language (created_date, updated_date, id, name, code) VALUES ('{0}', '{0}', '{1}', '{2}', '{3}')".format(sa.func.now(), index, value['language'], value['iso_code']))
    op.create_table('language_tenant_mapping',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=True),
    sa.Column('tenant_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['language_id'], ['language.id']),
    sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id']),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('language_id', 'tenant_id')
    )

def downgrade():
    op.execute("DELETE FROM language")
    op.drop_table('language_tenant_mapping')
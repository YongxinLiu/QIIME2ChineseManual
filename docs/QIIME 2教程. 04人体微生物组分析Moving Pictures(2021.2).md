[TOC]

# QIIME 2用户文档. 4人体各部位微生物组

**“Moving Pictures” tutorial**

https://docs.qiime2.org/2021.2/tutorials/moving-pictures/

本节1.6万字，14张图，3个视频。阅读时间大约40分钟。

> 注意：本文学习需要安装好QIIME 2，请务必完成[1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/sX7ab7ff_H6dyLwwjuYFjA)

在本教程中，你将使用QIIME 2在五个时间点对来自两个人四个身体部位的微生物组样本进行分析，第一个时间点紧接着是抗生素的使用。基于这些样本的[研究文章《Moving pictures of the human microbiome》在2011年发表于*Genome Biology*](https://www.ncbi.nlm.nih.gov/pubmed/21624126)。本教程中使用的数据基于Illumina HiSeq产出，使用[地球微生物组计划](http://earthmicrobiome.org/)扩增16S rRNA基因高变区4（V4）测序的方法。

> 对于熟悉QIIME 1的用户，本数据也出现在[QIIME的教程中](http://nbviewer.jupyter.org/github/biocore/qiime/blob/1.9.1/examples/ipynb/illumina_overview_tutorial.ipynb)。

在开始本教程前，我们需要进入工作环境创建新目录并进入

## 本节视频视频教程

https://v.qq.com/x/page/w0918ebti6m.html

**a文件准备和样本拆分**

https://v.qq.com/x/page/l0918vwb1no.html

**b结果查看、质控方法dada2/deblur并生成特征表**

https://v.qq.com/x/page/c09194lgqb5.html

**c进化树构建，多样性分析统计和可视化，物种注释和柱状图展示，差异比较**

查看更多视频和相应专辑，访问下方链接至作者个人频道，持续更新ing

http://v.qq.com/vplus/22b577627f014f0ca25e9827b38c171e

视频有广告，清晰度不够高吗？**在微信订阅号“meta-genome”后台回复“qiime2”获得1080p视频和测试数据下载链接**。

## 启动QIIME2运行环境

对于上文提到了两种常用安装方法，我们每次在分析数据前，需要打开工作环境，根据情况选择对应的打开方式。

比如我的工作目录为`~/github/QIIME2ChineseManual/2021.2`，这是与Github中同步的目录，方便同行下载测试数据。用户可以随便定义你的项目工作目录，如把qiime2学习放在`qiime2`目录中。

**我们在每次分析开始前，必须先进入工作目录**，除非你是一个把什么东西都放在桌面上还很工作更有效率的人。

```
# 定义工作目录变量，方便以后多次使用
wd=~/github/QIIME2ChineseManual/2021.2
mkdir -p $wd
# 进入工作目录，是不是很简介，这样无论你在什么位置就可以快速回到项目文件夹
cd $wd

# 方法1. 进入QIIME 2 conda工作环境
conda activate qiime2-2021.2
# 这时我们的命令行前面出现 (qiime2-2021.2) 表示成功进入工作环境

# 方法2. conda版本较老用户，使用source进入QIIME 2
source activate qiime2-2021.2

# 方法3. 如果是docker安装的请运行如下命令，默认加载当前目录至/data目录
docker run --rm -v $(pwd):/data --name=qiime -it  qiime2/core:2021.2

# 创建本节学习目录
mkdir moving-pictures
cd moving-pictures
```

## 样本元数据

**Sample metadata**

在开始分析之前，我们需要阅读样本元数据，以熟悉本研究中使用的样本信息。示例元数据作为Google 表格提供。你可以通过选择`File > Download as > Tab-separated values`，以制表符分隔的文本格式下载该文件。或者，以下命令将作为制表符分隔的文本下载示例元数据，并将其保存在文件`sample-metadata.tsv`。这个`sample-metadata.tsv`文件在本教程中一直被用到。

在Windows下可直接点击链接下载 https://data.qiime2.org/2021.2/tutorials/moving-pictures/sample_metadata.tsv， 保存为 `sample_metadata.tsv`；在Qiime 2中则用以下代码下载：

```
wget -c http://210.75.224.110/github/QIIME2ChineseManual/2021.2/moving-pictures/sample-metadata.tsv
```

注意：**QIIME 2 官方测试数据均保存在Google服务器上，国内下载比较困难**。以上下载链接已经替换为国内备份链接，可直接使用。也可使用代理服务器(如蓝灯、谷歌上网助手帮助)下载以上文件的原文件，国内用户可选在**QIIME 2中文Github页面 https://github.com/YongxinLiu/QIIME2ChineseManual  、或在<font color=red>微信订阅号“meta-genome”</font>后台回复"qiime2"等方式获取测试数据下载链接，提供多种备选方式保证数据可用**。

> 提示：[Keemei](https://keemei.qiime2.org/)是一个用于验证示例元数据的Google Sheets插件。在开始任何分析之前，样本元数据的验证非常重要。尝试按照Keemei网站上的说明安装Keemei，然后验证上面链接的示例元数据电子表格。该电子表格还包括一个带有一些无效数据的表格，以便使用Keemei进行测试。

> 提示：要了解关于元数据的更多信息，包括如何格式化元数据以便与QIIME 2一起使用，请参阅[元数据教程](https://docs.qiime2.org/2021.2/tutorials/metadata/)。


## 下载和导入数据

**Obtaining and importing data**

下载在本次分析中使用的序列。在本教程中，我们将处理完整的序列数据的一小部分，以便命令能够快速运行(减少等待时间)。

创建子目录并下载实验测序数据：

```
mkdir -p emp-single-end-sequences
# 3.6M
wget \
  -O "emp-single-end-sequences/barcodes.fastq.gz" \
  "https://data.qiime2.org/2021.2/tutorials/moving-pictures/emp-single-end-sequences/barcodes.fastq.gz"
# 24M
wget \
  -O "emp-single-end-sequences/sequences.fastq.gz" \
  "https://data.qiime2.org/2021.2/tutorials/moving-pictures/emp-single-end-sequences/sequences.fastq.gz"
  
```

用于输入到QIIME 2的所有数据都以QIIME 2对象的形式出现，其中包含有关数据类型和数据源的信息。因此，我们需要做的第一件事是将这些序列数据文件导入到QIIME 2对象中。

这个QIIME 2对象的语义类型是`EMPSingleEndSequences`。 QIIME 对象`EMPSingleEndSequences`是包含多样本混合的序列文件，这意味着序列尚未分配给样本（因此包括`sequences.fastq.gz`和`barcode.fastq.gz`文件，其中`barcode.fastq.gz`包含与`sequences.fastq.gz`中的每个序列相关联的条形码）。要导入其他格式的序列数据，请参阅[导入数据](https://docs.qiime2.org/2021.2/tutorials/importing/)教程。


导入数据：生成qiime2要求的对象格式。time统计计算时间。

```
time qiime tools import \
  --type EMPSingleEndSequences \
  --input-path emp-single-end-sequences \
  --output-path emp-single-end-sequences.qza
```

输出对象:

`emp-single-end-sequences.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Femp-single-end-sequences.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/emp-single-end-sequences.qza)

**译者注：公众号无法打开外部链接，如果想要直接访问`查看`、`下载`等文中链接，可访问位于[Github的QIIME2中文文档](https://github.com/YongxinLiu/QIIME2ChineseManual/tree/master/docs)、[CSDN的扩增子分析专栏](https://blog.csdn.net/woodcorpse/column/info/19197)、[QIIME 2论坛-社区贡献-翻译版块](https://forum.qiime2.org/c/community-contributions/community-translations)、或[科学网QIIME2专栏](http://blog.sciencenet.cn/home.php?mod=space&uid=3334560&do=blog&classid=173195&view=me&from=space)阅读同名文档，也可用百度搜索本节标题试试。**

> 提示：
上面的`查看`和`下载`由文档中的命令创建的QIIME 2对象和可视化链接。例如，上面的命令创建了单个`emp-single-end-sequences.qza`文件，上面链接了相应的预计算文件（输出结果）。你可以查看预计算的QIIME 2对象和可视化而不需要安装额外的软件（例如，QIIME 2）。

> QIIME 1用户：
在QIIME 1中，我们一般建议通过QIIME执行样本拆分（例如，使用`split_libraries.py`或`split_libraries_fastq.py`），因为这个步骤还执行序列的质量控制。现在我们将样本拆分和质量控制步骤分开，因此你可以使用混合多样本序列（如我们在此所做的）或拆分后的序列开始QIIME 2分析。

## 拆分样品

**Demultiplexing sequences**

为了混合序列进行样本拆分，我们需要知道哪个条形码序列与每个样本相关联。此信息包含在[样品元数据](https://data.qiime2.org/2021.2/tutorials/moving-pictures/sample_metadata)文件中。你可以运行以下命令来对序列进行样本拆分（`demux emp-single`命令指的是这些序列是根据[地球微生物组计划](http://earthmicrobiome.org/)标准方法添加的条形码，并且是单端序列）。QIIME 2对象`demux.qza`包含样本拆分后的序列。第二个输出文件 (`demux-details.qza`) 包括Golay标签错误校正的详细，在本教程中不作讨论 (你可以使用 `qiime metadata tabulate`查看该结果)。

```
# 用时1m
time qiime demux emp-single \
  --i-seqs emp-single-end-sequences.qza \
  --m-barcodes-file sample-metadata.tsv \
  --m-barcodes-column barcode-sequence \
  --o-per-sample-sequences demux.qza \
  --o-error-correction-details demux-details.qza
```


**输出结果**：

- `demux-details.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdemux-details.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/demux-details.qza)
- `demux.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdemux.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/demux.qza)

在样本拆分之后，生成拆分结果的统计信息非常重要。这允许我们确定每个样本获得多少序列，并且还可以获得序列数据中每个位置处序列质量分布的摘要。

**结果统计**

```
time qiime demux summarize \
  --i-data demux.qza \
  --o-visualization demux.qzv
```

输出可视化结果`demux.qzv`： [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdemux.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/demux.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.01.jpg)

**图1. 样本拆分结果统计结果——样本数据量可视化图表**。

主要分为三部分：上部为摘要；中部为样本不同数据量分布频率柱状图，可下载PDF，下部为每个样本的测序量。上方面板还可切换至交互式质量图`Interactive Qaulity Plot`页面。如下图2。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.02.gif)

**图2. 交互式质量图`Interactive Qaulity Plot`查看页面。**

同样为三部分：上部为每个位置碱基的质量分布交互式箱线图，鼠标悬停在上面，即可在下面(中部)文字和表格中显示鼠标所在位置碱基质量的详细信息；下部为拆分样本的长度摘要(一般等长测序无差别)。

> 注：
所有QIIME 2可视化对象（即使用`--o-visualization`参数指定的文件）将生成一个`.qzv`文件。你可以使用`qiime tools view`查看这些文件。我们提供了用于查看可视化的第一个命令，但是对于本教程的其余部分，我们将告诉你在运行可视化程序之后查看结果可视化，这意味着你应该在生成的`.qzv`文件上运`qiime tools view`。

```
qiime tools view demux.qzv
```

> 这条命令的显示需要图形界面的支持，如在有图型界面的Linux上，但仅使用SSH登陆方式无法显示图形。

**推荐使用 https://view.qiime2.org 网址显示结果**

可选使用[XShell+XManager支持SSH方式的图型界面](https://mp.weixin.qq.com/s/rbh3jynnq8E9tuhyCLtRIA)、虚拟机图形界面下或[服务器远程桌面](https://mp.weixin.qq.com/s/Ybr6RVotMi5VvsQHYB9R-g)方式支持上面命令的图形结果。

目前命令行方式想要查看结果可能很多使用服务器人员无法实现 (即依赖服务器安装了桌面，本地依赖XShell+XManager或其它ssh终端和图形界面软件)

**本地查看可解压`.qzv`，目录中的data目录包括详细的图表文件，主要关注 pdf 和 html 文件**，目录结构如下。

```
── demux
   └── 8743ab13-72ca-4adf-9b6c-d97e2dbe8ee3
       ├── checksums.md5
       ├── data
       │   ├── data.jsonp
       │   ├── demultiplex-summary.pdf
       │   ├── demultiplex-summary.png
       │   ├── dist
       │   │   ├── bundle.js
       │   │   ├── d3-license.txt
       │   │   └── vendor.bundle.js
       │   ├── forward-seven-number-summaries.csv
       │   ├── index.html
       │   ├── overview.html
       │   ├── per-sample-fastq-counts.csv
       │   ├── q2templateassets
       │   │   ├── css
       │   │   │   ├── bootstrap.min.css
       │   │   │   ├── normalize.css
       │   │   │   └── tab-parent.css
       │   │   ├── fonts
       │   │   │   ├── glyphicons-halflings-regular.eot
       │   │   │   ├── glyphicons-halflings-regular.svg
       │   │   │   ├── glyphicons-halflings-regular.ttf
       │   │   │   ├── glyphicons-halflings-regular.woff
       │   │   │   └── glyphicons-halflings-regular.woff2
       │   │   ├── img
       │   │   │   └── qiime2-rect-200.png
       │   │   └── js
       │   │       ├── bootstrap.min.js
       │   │       ├── child.js
       │   │       ├── jquery-3.2.0.min.js
       │   │       └── parent.js
       │   └── quality-plot.html
       ├── metadata.yaml
       ├── provenance
       │   ├── action
       │   │   └── action.yaml
       │   ├── artifacts
       │   │   ├── 9594ef07-c414-4658-9345-c726de100d8d
       │   │   │   ├── action
       │   │   │   │   └── action.yaml
       │   │   │   ├── citations.bib
       │   │   │   ├── metadata.yaml
       │   │   │   └── VERSION
       │   │   └── a7a882f3-5e4f-4b5e-8a35-6a1098d21608
       │   │       ├── action
       │   │       │   ├── action.yaml
       │   │       │   └── barcodes.tsv
       │   │       ├── citations.bib
       │   │       ├── metadata.yaml
       │   │       └── VERSION
       │   ├── citations.bib
       │   ├── metadata.yaml
       │   └── VERSION
       └── VERSION
```

qzv文件解压后文件详细，可直接访问`data/index.html`打开结果报告式网页。里面的重要结果，全部可以通过此网页进行索引。

## 序列质控和生成特征表

**Sequence quality control and feature table construction**

QIIME 2插件多种质量控制方法可选，包括[DADA2](https://www.ncbi.nlm.nih.gov/pubmed/27214047)、[Deblur](http://msystems.asm.org/content/2/2/e00191-16)和[基于基本质量分数的过滤](http://www.nature.com/nmeth/journal/v10/n1/abs/nmeth.2276.html)。在本教程中，我们使用[DADA2](https://www.ncbi.nlm.nih.gov/pubmed/27214047)和[Deblur](http://msystems.asm.org/content/2/2/e00191-16)两种方法分别介绍这个步骤。这些步骤是可互相替换的，因此你可以使用自己喜欢的方法。这两种方法的结果将是一个QIIME 2特征表`FeatureTable[Frequency]`和一个代表性序列`FeatureData[Sequence]`对象，`Frequency`对象包含数据集中每个样本中每个唯一序列的计数（频率），`Sequence`对象将`FeatureTable`中的特征ID与序列对应。

**译者注**：此步主要有DADA2和Deblur两种方法可选，推荐使用DADA2，2016年发表在Nature Method上，在阴道菌群研究中比OTU聚类结果看到更多细节，详见《[扩增子分析还聚OTU就真OUT了](http://mp.weixin.qq.com/s/D3qKT7mYEg52nCfQWF75wg)》；相较USEARCH的UPARSE算法，目前DADA2方法仅去噪去嵌合，不再按相似度聚类，结果与真实物种的序列更接近。

> 注意：本节中此次存在两种可选方法时，你将创建具有特定方法名称的对象（例如，使用dada2去噪生成的特性表将被称为`table-dada2.qza`）。在创建这些对象之后，你将把两个选项之一的对象重命名为更通用的文件名（例如，`table.qza`）。为对象创建特定名称，然后对其进行重命名的过程仅允许你选择在本步骤中使用的两个选项中之一完成教程，而不必再次关注该选项。需要注意的是，在这个步骤或QIIME 2中的任何步骤中，你给对象或可视化的文件命名并不重要。

> QIIME1 用户注意：
QIIME 2对象`FeatureTable[Frequency]`等价于QIIME 1 OTU或BIOM表，QIIME 2对象`FeatureData[Sequence]`等价于QIIME 1代表序列文件。由于DADA2和Deblur产生的“OTU”是通过对唯一序列进行分组而创建的，因此这些OTU相当于来自QIIME 1的100%相似度的OTU，通常称为序列变体。在QIIME 2中，这些OTU比QIIME 1默认的97%相似度聚类的OTU具有更高的分辨率，并且它们具有更高的质量，因为这些质量控制步骤比QIIME 1中实现更好。因此，与QIIME 1相比，可以对样本的多样性和分类组成进行更准确的估计。

### 方法1. DADA2 

**Option 1: DADA2**

DADA2是用于检测和校正（如果有可能的话）Illumina扩增序列数据的工作流程。正如在`q2-dada2`插件中实现的，这个质量控制过程将过滤掉在测序数据中鉴定的任何`phiX`序列（通常存在于标记基因Illumina测序数据中，用于提高扩增子测序质量），并同时过滤嵌合序列。

> 译者注：DADA2是Susan P. Holmes团队于2016年发表于Nature Methods的文章，截止18年12月22号Google学术统计引用483次，关于教授的工作介绍，详见[《斯坦福大学统计系教授带你玩转微生物组分析》](https://mp.weixin.qq.com/s/Zcjhi6fnXQHIqPodDSPBnw)；关于dada2简介，详见《[扩增子分析还聚OTU就真OUT了](http://mp.weixin.qq.com/s/D3qKT7mYEg52nCfQWF75wg)》。DADA2自身也是一套在R语言中完整的扩增子分析流程，中文教程详见《[DADA2中文教程v1.8](https://mp.weixin.qq.com/s/acvX4IkuPj-Hi8uOjuVbPA)》。引文： Callahan, Benjamin J., Paul J. McMurdie, Michael J. Rosen, Andrew W. Han, Amy Jo A. Johnson, and Susan P. Holmes. "DADA2: high-resolution sample inference from Illumina amplicon data." Nature methods 13, no. 7 (2016): 581.

`dada2 denoise-single`方法需要两个用于质量过滤的参数：`--p-trim-left m`，它去除每个序列的前m个碱基(如引物、标签序列barcode)；`--p-trunc-len n`，它在位置n截断每个序列。这允许用户去除序列的低质量区域、引物或标签序列等。为了确定要为这两个参数传递什么值，你应该查看上面由`qiime demux summarize`生成的`demux.qzv`文件中的交互质量图选项卡。

> 读者思考时间：基于上图`demux.qzv`对拆分样品的统计结果，如何设置`--p-trunc-len`和`--p-trim-left`的参数值。

1. --p-trim-left 截取左端低质量序列，我们看上图中箱线图，左端质量都很高，无低质量区，设置为0；
2. --p-trunc-len 序列截取长度，也是为了去除右端低质量序列，我们看到大于120以后，质量下降极大，甚至中位数都下降至20以下，需要全部去除，综合考虑决定设置为120。

单端序列去噪, 输入样本拆分后结果；去除左端 0 bp (--p-trim-left，有时用于切除低质量序列、barocde或引物)，序列切成 120 bp 长(--p-trunc-len)；生成代表序列、特征表和去噪过程统计。

下面的步骤计算量较大，有34个样本，26万条序列，计算大约消耗10分钟。

```
# 本地46s，服务器1m23m，笔记本单核比服务器更快
time qiime dada2 denoise-single \
  --i-demultiplexed-seqs demux.qza \
  --p-trim-left 0 \
  --p-trunc-len 120 \
  --o-representative-sequences rep-seqs-dada2.qza \
  --o-table table-dada2.qza \
  --o-denoising-stats stats-dada2.qza
 # 实际计算时间，即受服务器配置影响，还受同台服务器上任务量影响
```

生成三个输出文件：
- `stats-dada2.qza`: dada2计算统计结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fstats-dada2.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/stats-dada2.qza)
- `table-dada2.qza`: 特征表。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Ftable-dada2.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/table-dada2.qza)
- `rep-seqs-dada2.qza`: 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Frep-seqs-dada2.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/rep-seqs-dada2.qza)

对特征表统计进行进行可视化

```
qiime metadata tabulate \
  --m-input-file stats-dada2.qza \
  --o-visualization stats-dada2.qzv
```

输出样本统计表：`stats-dada2.qzv`，[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fstats-dada2.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/stats-dada2.qzv)

内容为每个样本，输入、过滤、去噪和非嵌合的统计，**并支持按列排序，检索和功能**，用于样本异常筛选，特征表抽平标准化非常有用。

表格前3行示例如下:

sample-id|input|filtered| denoised| non-chimeric
-|-|-|-|-
L6S93|11270|7483|7483|7025
L6S68|9554|6169|6169|6022

我们的下游分析，将继续使用dada2的结果，需要将它们改名方便继续分析：

```
mv rep-seqs-dada2.qza rep-seqs.qza
mv table-dada2.qza table.qza
```

### 方法2. Deblur 

Deblur使用序列错误配置文件将错误的序列与从其来源的真实生物序列相关联，从而得到高质量的序列变异数据，主要为两个步骤。首先，应用基于质量分数的初始质量过滤过程，是Bokulich等人2013年发表的质量过滤方法。

> 详者注：Deblur是本软件作者作为通讯作者2013发表于Nature Methods的重要扩增子代表序列鉴定方法，截止19年8月25号Google学术统计引用1259次，
引文：Bokulich, Nicholas A., et al. "Quality-filtering vastly improves diversity estimates from Illumina amplicon sequencing." Nature methods 10.1 (2013): 57. https://doi.org/10.1038/nmeth.2276 作者只将自己的方法作为了备选，分析教程中首选了dada2方法。

按测序碱基质量过滤序列

```
# 用时：笔记本25s，服务器44s
time qiime quality-filter q-score \
 --i-demux demux.qza \
 --o-filtered-sequences demux-filtered.qza \
 --o-filter-stats demux-filter-stats.qza
```

输出对象:
- `demux-filtered.qza`: 序列质量过滤后结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdemux-filtered.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/demux-filtered.qza)
- `demux-filter-stats.qza`: 序列质量过滤后结果统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdemux-filter-stats.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/demux-filter-stats.qza)

> 注意：在[Deblur的论文](http://msystems.asm.org/content/2/2/e00191-16)中，作者使用了当时推荐的过滤参数。而这里使用的[参数基于最新的经验](https://qiita.ucsd.edu/static/doc/html/deblur_quality.html)，效果更好。

接下来，使`qiime deblur denoise-16S`方法应用于Deblur工作流程。此方法需要一个用于质量过滤的参数，即截断位置n长度的序列的`--p-trim-length n`。通常，Deblur开发人员建议将该值设置为质量分数中位数开始下降至低质量区时的长度。在本次数据上，质量图（在质量过滤之前）表明合理的选择是在115至130序列位置范围内。这是一个主观的评估。你可能不采用该建议的一种原因是存在多个批次测序的元分析。在这种情况的元分析中，**比较所有批次的序列长度是否相同，以避免人为引入特定的偏差，全局考虑这些是非常重要的**。由于我们已经使用修剪长度为120 bp用于`qiime dada2 denoise-single`分析，并且由于120 bp是基于质量图的结果，这里我们将使用`--p-trim-length 120`参数。下一个命令可能需要10分钟才能运行完成。

> 详者注：deblur最大缺点就是慢，本次只分析了33个样品，共177,092条序列。而实际研究中大项目会有成千上万的样本，1亿-10亿条序列，此步分析可能需要几个月甚至根本无法完成，不推荐。

deblur去噪16S过程，输入文件为质控后的序列，设置截取长度参数，生成结果文件有代表序列、特征表、样本统计。

```
# 用时：笔记本3m11s，服务器5m50s
time qiime deblur denoise-16S \
  --i-demultiplexed-seqs demux-filtered.qza \
  --p-trim-length 120 \
  --o-representative-sequences rep-seqs-deblur.qza \
  --o-table table-deblur.qza \
  --p-sample-stats \
  --o-stats deblur-stats.qza
```

> 注：在测试服务器上单线程运行时间为5m50s，比原作者测试时间快了1倍。笔记本也比服务器快近1倍，因为核心频率更高。但服务器的线程数更多，在需要多线程的任务时，优势会非常明显。

输出结果:

- `deblur-stats.qza:` 过程统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdeblur-stats.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/deblur-stats.qza)
- `table-deblur.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Ftable-deblur.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/table-deblur.qza)
- `rep-seqs-deblur.qza`: 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Frep-seqs-deblur.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/rep-seqs-deblur.qza)

> 注意： 本节中使用的两种命令生成包含汇总统计信息的QIIME 2对象。为了查看这些汇总统计数据，你可以分别使用`qiime metadata tabulate`和`qiime deblur visualize-stats`命令来分别可视化这两种命令的输出文件。

```
qiime metadata tabulate \
  --m-input-file demux-filter-stats.qza \
  --o-visualization demux-filter-stats.qzv
qiime deblur visualize-stats \
  --i-deblur-stats deblur-stats.qza \
  --o-visualization deblur-stats.qzv
```

输出结果:

- `demux-filter-stats.qzv`: 质量过程统计表，同上面提到的`stats-dada2.qzv`统计表类似。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdemux-filter-stats.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/demux-filter-stats.qzv)

示例如下：包括6列，第一列为样本名称，2-6列分别为总输入读长、总保留高读长、截断的读长、截断后太短的读长和超过最大模糊碱基的读长的数量统计。我们通常只关注2，3列数量即可，其它列常用于异常的输助判断。

sample-id|total-input-reads|total-retained-reads|reads-truncated|reads-too-short-after-truncation|reads-exceeding-maximum-ambiguous-bases
-|-|-|-|-|-
#q2:types|numeric|numeric|numeric|numeric|numeric
L1S105|11340|9232|10782|2066|42
L1S140|9738|8585|9459|1113|40
L1S208|11337|10149|10668|1161|27

- deblur-stats.qzv: deblur分析统计表，有分析中每个步骤的统计表 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fdeblur-stats.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/deblur-stats.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.03.jpg)

**图3. deblur去噪和鉴定ASV处理过程统计结果**

如果你想用此处结果下游分析，可以改名为下游分析的起始名称：

这处演示不运行下面两行代码，前面添加"#"号代表注释，需要运行请自行删除行首的“#”

```
#mv rep-seqs-deblur.qza rep-seqs.qza
#mv table-deblur.qza table.qza
```

> **详者注：记住，以上两种方法只选择一种即可。推荐dada2速度更快一些，步骤也少一些。有精力的条件下，可以两种方法都试试，比较一下两种方法哪个结果更适合自己。其实每种方法都有存在的意义，而且也有适用的范围，要在具体的项目中，结合背景知识分析哪种方法结果更好时才知道。**

## 特征表和特征序列汇总

**FeatureTable and FeatureData summaries**

在质量筛选步骤完成之后，你将希望探索数据结果。可以使用以下两个命令进行此操作，这两个命令将创建数据的可视化摘要。特性表汇总命令（`feature-table summarize`）将向你提供关于与每个样品和每个特性相关联的序列数量、这些分布的直方图以及一些相关的汇总统计数据的信息。特征表序列表格`feature-table tabulate-seqs`命令将提供特征ID到序列的映射，并提供链接以针对NCBI nt数据库轻松BLAST每个序列。当你想要了解关于数据集中重要特性的更多信息时，可视化将在本教程的后续分析中非常有用。

```
qiime feature-table summarize \
  --i-table table.qza \
  --o-visualization table.qzv \
  --m-sample-metadata-file sample-metadata.tsv
  
qiime feature-table tabulate-seqs \
  --i-data rep-seqs.qza \
  --o-visualization rep-seqs.qzv
```

输出结果:

- table.qzv: 特征表统计。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Ftable.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/table.qzv)
- rep-seqs.qzv: 代表序列统计，可点击序列跳转NCBI blast查看相近序列的信息。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Frep-seqs.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/rep-seqs.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.04.jpg)

**图4. 图中展示了特征表的统计结果**

上为摘要、中间为样本数据量分布和图，下方为特征出现频率的统计表和图。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.05.gif)

**图5. 交互式查看每组剩余样本量**

右侧还有`Feature Detail`进一步查看每个特征的频率和在样本中出现的次数

## 构建进化树用于多样性分析

**Generate a tree for phylogenetic diversity analyses**

QIIME 2支持几种系统发育多样性度量方法，包括`Faith’s Phylogenetic Diversity`、`weighted`和`unweighted UniFrac`。除了每个样本的特征计数（即QIIME2对象`FeatureTable[Frequency]`）之外，这些度量还需要将特征彼此关联结合有根进化树。此信息将存储在一个QIIME 2对象的有根系统发育对象`Phylogeny[Rooted]`中。为了生成系统发育树，我们将使用`q2-phylogeny`插件中的`align-to-tree-mafft-fasttree`工作流程。

首先，工作流程使用`mafft`程序执行对`FeatureData[Sequence]`中的序列进行多序列比对，以创建QIIME 2对象`FeatureData[AlignedSequence]`。接下来，流程屏蔽（mask或过滤）对齐的的高度可变区(高变区)，这些位置通常被认为会增加系统发育树的噪声。随后，流程应用`FastTree`基于过滤后的比对结果生成系统发育树。FastTree程序创建的是一个无根树，因此在本节的最后一步中，应用根中点法将树的根放置在无根树中最长端到端距离的中点，从而形成有根树。

```
time qiime phylogeny align-to-tree-mafft-fasttree \
  --i-sequences rep-seqs.qza \
  --o-alignment aligned-rep-seqs.qza \
  --o-masked-alignment masked-aligned-rep-seqs.qza \
  --o-tree unrooted-tree.qza \
  --o-rooted-tree rooted-tree.qza
```

> 详者注：多序列比对和建树在分析中是计算量很大的步骤，本测试数据量很小，只用了14秒，实际上千个样本，可能会使用几十分钟，甚至几小时至几天

输出结果文件:

- `aligned-rep-seqs.qza`: 多序列比对结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Faligned-rep-seqs.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/aligned-rep-seqs.qza)
- `masked-aligned-rep-seqs.qza`: 过滤去除高变区后的多序列比对结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fmasked-aligned-rep-seqs.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/masked-aligned-rep-seqs.qza)
- `rooted-tree.qza`: 有根树，用于多样性分析。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Frooted-tree.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/rooted-tree.qza)
- `unrooted-tree.qza`: 无根树。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Funrooted-tree.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/unrooted-tree.qza)

## Alpha和beta多样性分析

**Alpha and beta diversity analysis**

QIIME 2的多样性分析使用`q2-diversity`插件，该插件支持计算α和β多样性指数、并应用相关的统计检验以及生成交互式可视化图表。我们将首先应用`core-metrics-phylogenetic`方法，该方法将`FeatureTable[Frequency]`(特征表[频率])抽平到用户指定的测序深度，然后计算几种常用的α和β多样性指数，并使用`Emperor`为每个β多样性指数生成主坐标分析（PCoA）图。默认情况下计算的方法有：

**划重点：理解下面4种alpha和beta多样性指数的所代表的生物学意义至关重要。**

- α多样性
    - 香农(Shannon’s)多样性指数（群落丰富度的定量度量，即包括丰富度`richness`和均匀度`evenness`两个层面）
    - 可观测的OTU(Observed OTUs，群落丰富度的定性度量，只包括丰富度）
    - Faith’s系统发育多样性（包含特征之间的系统发育关系的群落丰富度的定性度量）
    - 均匀度Evenness（或 Pielou’s均匀度；群落均匀度的度量）
- β多样性
    - Jaccard距离（群落差异的定性度量，即只考虑种类，不考虑丰度）
    - Bray-Curtis距离（群落差异的定量度量，较常用）
    - 非加权UniFrac距离（包含特征之间的系统发育关系的群落差异定性度量）
    - 加权UniFrac距离（包含特征之间的系统发育关系的群落差异定量度量）

需要提供给这个脚本的一个重要参数是`--p-sampling-depth`，它是指定重采样（即稀疏/稀疏`rarefaction`）深度。因为大多数多样指数对不同样本的不同测序深度敏感，所以这个脚本将随机地将每个样本的测序量重新采样至该参数值。例如，提供`--p-sampling-depth 500`，则此步骤将对每个样本中的计数进行无放回抽样，从而使得结果表中的每个样本的总计数为500。如果任何样本的总计数小于该值，那么这些样本将从多样性分析中删除。选择这个值很棘手。我们建议你通过查看上面创建的表`table.qzv`文件中呈现的信息并**选择一个尽可能高的值（因此每个样本保留更多的序列）同时尽可能少地排除样本来进行选择**。

> 读者思考时间：
查看QIIME 2的`table.qzv` 对象，尤其是交互式可视化表格。对于采样深度`--p-sampling-depth`，应该选择什么值呢？根据这个选择，分析中多少个样本将被排除？在`core-metrics-phylogenetic`命令中，你将分析的总序列是多少条呢？

> 译者注：下面多样性分析，需要基于重采样/抽平(rarefaction)标准化的特征表，标准化采用无放回重抽样至序列一致，如何设计样品重采样深度参数`--p-sampling-depth`呢？
如是数据量都很大，选最小的即可。如果有个别数据量非常小，去除最小值再选最小值。比如此分析最小值为917，我们选择1109深度重采样，即保留了大部分样品用于分析，又去除了数据量过低的异常值。本示例为近10年前测序技术的通量水平，454测序时代抽平至1000条即可，现在看来数据量很小。目录一般采用HiSeq2500或NovaSeq6000的 PE250模式测序，数据量都非常大，通常可以采用3万或5万的标准抽平，仍可保留90%以上样本。过低或过高一般结果也会波动较大，不建议放在一起分析。

计算核心多样性

```
time qiime diversity core-metrics-phylogenetic \
  --i-phylogeny rooted-tree.qza \
  --i-table table.qza \
  --p-sampling-depth 1103 \
  --m-metadata-file sample-metadata.tsv \
  --output-dir core-metrics-results
```

此步计算耗时9秒。在大数据时，可能会计算更多时间。尤其是样本量增加，计算量会随样本平方增长。

输出对象(13个数据文件):

- core-metrics-results/faith_pd_vector.qza: Alpha多样性考虑进化的faith指数。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Ffaith_pd_vector.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/faith_pd_vector.qza)
- core-metrics-results/unweighted_unifrac_distance_matrix.qza: 无权重unifrac距离矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Funweighted_unifrac_distance_matrix.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/unweighted_unifrac_distance_matrix.qza)
- core-metrics-results/bray_curtis_pcoa_results.qza: 基于Bray-Curtis距离PCoA的结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fbray_curtis_pcoa_results.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/bray_curtis_pcoa_results.qza)
- core-metrics-results/shannon_vector.qza: Alpha多样性香农指数。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fshannon_vector.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/shannon_vector.qza)
- core-metrics-results/rarefied_table.qza: 等量重采样后的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Frarefied_table.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/rarefied_table.qza)
- core-metrics-results/weighted_unifrac_distance_matrix.qza: 有权重的unifrac距离矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fweighted_unifrac_distance_matrix.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/weighted_unifrac_distance_matrix.qza)
- core-metrics-results/jaccard_pcoa_results.qza: jaccard距离PCoA结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fjaccard_pcoa_results.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/jaccard_pcoa_results.qza)
- core-metrics-results/observed_otus_vector.qza: Alpha多样性observed otus指数。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fobserved_otus_vector.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/observed_otus_vector.qza)
- core-metrics-results/weighted_unifrac_pcoa_results.qza: 基于有权重的unifrac距离的PCoA结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fweighted_unifrac_pcoa_results.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/weighted_unifrac_pcoa_results.qza)
- core-metrics-results/jaccard_distance_matrix.qza: jaccard距离矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fjaccard_distance_matrix.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/jaccard_distance_matrix.qza)
- core-metrics-results/evenness_vector.qza: Alpha多样性均匀度指数。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fevenness_vector.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/moving-pictures/core-metrics-results/evenness_vector.qza)
- core-metrics-results/bray_curtis_distance_matrix.qza: Bray-Curtis距离矩阵。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fbray_curtis_distance_matrix.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/bray_curtis_distance_matrix.qza)
core-metrics-results/unweighted_unifrac_pcoa_results.qza: 无权重的unifrac距离的PCoA结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Funweighted_unifrac_pcoa_results.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/unweighted_unifrac_pcoa_results.qza)

**输出对象(4种可视化结果)**:

- core-metrics-results/unweighted_unifrac_emperor.qzv：无权重的unifrac距离PCoA结果采用emperor可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Funweighted_unifrac_emperor.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/unweighted_unifrac_emperor.qzv)
- core-metrics-results/jaccard_emperor.qzv：jaccard距离PCoA结果采用emperor可视化。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fjaccard_emperor.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/jaccard_emperor.qzv)
- core-metrics-results/bray_curtis_emperor.qzv： Bray-Curtis距离PCoA结果采用emperor可视化。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fbray_curtis_emperor.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/bray_curtis_emperor.qzv)
- core-metrics-results/weighted_unifrac_emperor.qzv： 有权重的unifrac距离PCoA结果采用emperor可视化。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fweighted_unifrac_emperor.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/weighted_unifrac_emperor.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.06.gif)

**图6. 以weighted_unifrac距离的PCoA结果交互式可视化为例**，可用鼠标托动空间查看每个样本的分布位置。

这里，我们将`--p-sampling-depth`参数设置为1103。这个值是根据`L3S313`样本中的序列数量来选择的，因为它与接下来几个序列计数较高的样本中的序列数量接近，并且它比序列较少的样本中的序列数量高。这将允许我们保留大部分样品。具有较少序列的三个样本将从`core-metrics-phylogenetic`分析和任何使用这些结果的下游分析中删除。

> 注意：根据DADA2特征表汇总选择1103的采样深度。如果使用的是Deblur特性表而不是DADA2特性表，则可能需要选择不同的采样深度。应用上一段的逻辑来帮助你选择合理的采样深度。

> 注意：在许多Illumina测序结果中，你将观察到一些序列计数非常低的例子。你通常希望通过在此阶段采样深度选择更大的值来从分析中剔除它们。

在计算多样性度量之后，我们可以开始在样本元数据的分组信息或属性值背景下探索样本的微生物组成差异。此信息存在于先前下载的示例[元数据](https://data.qiime2.org/2021.2/tutorials/moving-pictures/sample_metadata)文件中。

我们将首先测试分类元数据列和alpha多样性数据之间的关系。我们将在这里为`Faith`系统发育多样性（群体丰富度的度量）和`Evenness`均匀度进行可视化操作。

**Alpha多样性组间显著性分析和可视化**

```
qiime diversity alpha-group-significance \
  --i-alpha-diversity core-metrics-results/faith_pd_vector.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization core-metrics-results/faith-pd-group-significance.qzv

qiime diversity alpha-group-significance \
  --i-alpha-diversity core-metrics-results/evenness_vector.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization core-metrics-results/evenness-group-significance.qzv

```

输出可视化结果：

- core-metrics-results/faith-pd-group-significance.qzv。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Ffaith-pd-group-significance.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/faith-pd-group-significance.qzv)
- core-metrics-results/evenness-group-significance.qzv。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fevenness-group-significance.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/evenness-group-significance.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.07.gif)

**图7. 以`faith-pd`为例将互探索不同元数据条件下组间差异**，可用鼠标选择不同元数据的列名，切换分组方式，探索对应的生物学意义。

> 问题：哪些分类样本元数据列与微生物群落丰富度的差异密切相关？这些差异在统计学上有显著性吗？

> 读者思考时间：实验设计中的那一种分组方法，与微生物群体的丰富度差异相关，这些差异显著吗？

> 详者注：图中可按`Column`选择分类方法，查看不同分组下箱线图间的分布与差别。图形下面的表格，详细详述了组间比较的显著性和假阳性率统计。  
结果我们会看到本实验设计的分组方式有`body-site`, `subject`, `report-antibiotic-use`，只有身体位置各组间差异明显，且下面统计结果也存在很多组间的显著性差异。

在这个数据集中，连续的样本元数据列（例如，`days-since-experiment-start`）不与α多样性有相关联，所以我们这里不测试这类关联。如果你有兴趣执行这类测试（对于这个数据集或其他数据集），可以使用`qiime diversity alpha-correlation`命令。

接下来，我们将使用PERMANOVA方法（[在Anderson 2001年的文章中首次描述](http://onlinelibrary.wiley.com/doi/10.1111/j.1442-9993.2001.01070.pp.x/full)）`beta-group-significance`分析分类型元数据的样本组间差异。以下命令将测试一组样本之间的距离，是否比来自其他组(例如，舌头、左手掌和右手掌)的样本彼此更相似，例如来自同一身体部位(例如肠)的样本。如果你用这个命令的`--p-pairwise`参数，它将执行成对检验，结果将允许我们确定哪对特定组（例如，舌头和肠）彼此不同是否显著不同。这个**命令运行起来可能很慢，尤其是当使用`--p-pairwise`参数，因为它是基于置换检验的**。因此，我们将在元数据的特定列上运行该命令，而不是在其适用的所有元数据列上运行该命令。这里，我们将使用两个示例元数据列将此应用到未加权的UniFrac距离，如下所示。

```
# 7s，多组或多样本时计算量指数增长
time qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column body-site \
  --o-visualization core-metrics-results/unweighted-unifrac-body-site-significance.qzv \
  --p-pairwise

# 6s，多组或多样本时计算量指数增长
time qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column subject \
  --o-visualization core-metrics-results/unweighted-unifrac-subject-group-significance.qzv \
  --p-pairwise
  
```

输出可视化结果:

- `core-metrics-results/unweighted-unifrac-body-site-significance.qzv`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Funweighted-unifrac-body-site-significance.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/unweighted-unifrac-body-site-significance.qzv)
- `core-metrics-results/unweighted-unifrac-subject-group-significance.qzv`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Funweighted-unifrac-subject-group-significance.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/unweighted-unifrac-subject-group-significance.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.08.jpg)

**图8. 不同部分组内和组间差异显著性分析，采用箱线图+统计表呈现**

> 问题：受试者之间的关联和微生物组成的差异在统计学上是否显著？身体部位呢？哪些特定的身体部位对彼此有显著的不同？

同样，我们对于这个数据集所拥有的连续样本元数据中没有一个与样本组成相关，因此这里我们不会测试这些关联。如果你对执行这些测试感兴趣，那么可以使用`qiime metadata distance-matrix`结合`qiime diversity mantel`和`qiime diversity bioenv`命令组合使用。

最后，排序是在样本元数据分组间探索微生物群落组成差异的流行方法。我们可以使用[Emperor工具](http://emperor.microbio.me/)在示例元数据下探索主坐标分析（PCoA）绘图。虽然我们的`core-metrics-phylogenetic`命令已经生成了一些Emperor图，但我们希望传递一个可选的参数`--p-custom-axes`，这对于探索时间序列数据非常有用。采于`core-metrics-phylogeny`的PCoA结果也是一样的，这使得很容易与Emperor生成新的可视化。我们将采用未加权的UniFrac和Bray-Curtis的PCoA结果生成Emperor图，以便所得到的图将包含主坐标1、主坐标2和实验开始以来的天数(days since the experiment start)的轴。我们将使用最后一个轴来探索这些样本是如何随时间变化的。

```
qiime emperor plot \
  --i-pcoa core-metrics-results/unweighted_unifrac_pcoa_results.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-custom-axes days-since-experiment-start \
  --o-visualization core-metrics-results/unweighted-unifrac-emperor-days-since-experiment-start.qzv

qiime emperor plot \
  --i-pcoa core-metrics-results/bray_curtis_pcoa_results.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-custom-axes days-since-experiment-start \
  --o-visualization core-metrics-results/bray-curtis-emperor-days-since-experiment-start.qzv
  
```

输出可视化：
- `core-metrics-results/bray-curtis-emperor-days-since-experiment-start.qzv`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Fbray-curtis-emperor-days-since-experiment-start.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/bray-curtis-emperor-days-since-experiment-start.qzv)
- `core-metrics-results/unweighted-unifrac-emperor-days-since-experiment-start.qzv`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcore-metrics-results%2Funweighted-unifrac-emperor-days-since-experiment-start.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/core-metrics-results/unweighted-unifrac-emperor-days-since-experiment-start.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.09.jpg)

**图9. 探索样本在第1/2主轴和时间上的分布**，调整右侧着色方式和颜色方案可方便观察研究的分类或时间序列结果。


> 问题：Emperor图是否支持我们在这里执行的其他β多样性分析？（提示：对不同实验元数据进行点着色。）

> 问题：在未加权的UniFrac和Bray-Curtis PCoA图中，你观察到了哪些差异？

## Alpha稀疏曲线

**Alpha rarefaction plotting**

在本节中，我们将使用`qiime diversity alpha-rarefaction`可视化工具来探索α多样性与采样深度的关系。该可视化工具在多个采样深度处计算一个或多个α多样性指数，范围介于1（可选地`--p-min-depth`控制）和最大采样深度`--p-max-depth`提供值之间。在每个采样深度，将生成10个抽样表，并对表中的所有样本计算alpha多样性指数计算。迭代次数（在每个采样深度计算的稀疏表）可以通过`--p-iterations`来控制。在每个采样深度，将为每个样本绘制平均多样性值，如果提供样本元数据`--m-metadata-file`参数，则可以基于元数据对样本进行分组。

```
# 用时：笔记本1m13S，服务器40s，本步计算量较大。
time qiime diversity alpha-rarefaction \
  --i-table table.qza \
  --i-phylogeny rooted-tree.qza \
  --p-max-depth 4000 \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization alpha-rarefaction.qzv
  
```

输出可视化：
- alpha-rarefaction.qzv: 稀疏曲线。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Falpha-rarefaction.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/alpha-rarefaction.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.10.jpg)

**图10. 查看按身体部位(body site)分组下可观测(observed) otus的稀疏箱线图**，注意观察图中变化以及下面对应样本数据的图。

可视化将有两个图。顶部图是α稀疏图(rarefaction plot)，主要用于确定样品的丰度是否已被完全观察或测序。如果图中的线条在沿x轴的某个采样深度处看起来“平坦(level out)”（即斜率接近于零），这表明收集超过该采样深度的附加序列不太可能观测到新特征。如果绘图中的线条没有变平，这可能是因为尚未充分观察样本的丰富度（由于测序的序列太少），或者它可能是在数据中仍然存在许多测序错误（被误认为是新的多样性）。

当通过元数据对样本进行分组时，此可视化中结果底部的绘图结果非常重要。它说明了当特征表被细化到每个采样深度时，每个组中剩余的样本数量。如果给定的采样深度`d`大于样本`s`的总频率(即，针对样本`s`获得的序列数)，则不可能计算采样深度`d`下样本`s`的多样性。在顶部绘图将不可靠，因为它将计算基于相对少的样本。因此，当通过元数据对样本进行分组时，必须查看底部图表，以确定顶部图表中显示的数据是否可靠的。

> 注意：提供的`--p-max-depth`参数的值应该通过查看上面创建的`table.qzv`文件中呈现的“每个样本的测序量”信息来确定。一般来说，选择一个在中位数附近的值似乎很好用。如果得到的稀疏图中的线看起来没有变平，那么你可能希望增加该值。如果由于大于最大采样深度而丢失了许多样本，则减少该值。

> 问题1：当通过“body-site”列信息对样本进行分组并查看“observed_otus”指数的α稀疏图时，哪些身体部位显示出足够的多样性覆盖（即稀疏曲线趋于平缓）？在这些身体部位似乎存在多少序列变异？

> 问题2：当通过“body-site”对样本进行分组并查看“observed_otus”指数的α稀疏图时，“右手掌(right palm)”样本的线看起来在40左右变平，但随后跳到大约140。你认为这里发生了什么？（提示：一定要查看顶部和底部的细节。）

> 译者注答案：问题2左手掌的多样性从突然40跳至140，而对应的样本量从9个下降为3个(由于测序深度不足)。仅有3次生物学重复样本量太少，偶然性太大，导致的结果波动大但可信度不高。问题1很简单，自己看图吧可以想出答案。

## 物种组成分析

**Taxonomic analysis**

在这一节中，我们将开始探索样本的物种组成，并将其与样本元数据再次组合。这个过程的第一步是为`FeatureData[Sequence]`的序列进行物种注释。我们将使用经过Naive Bayes分类器预训练的，并由`q2-feature-classifier`插件来完成这项工作。这个分类器是在`Greengenes 13_8 99% OTU`上训练的，其中序列被修剪到仅包括来自16S区域的250个碱基，该16S区域在该分析中采用V4区域的515F/806R引物扩增并测序。我们将把这个分类器应用到序列中，并且可以生成从序列到物种注释结果关联的可视化。

> 注意：物种分类器根据你特定的样品制备和测序参数进行训练时表现最好，包括用于扩增的引物和测序序列的长度。因此，一般来说，你应该按照[使用`q2-feature-classifier`的训练特征分类器](https://docs.qiime2.org/2021.2/tutorials/feature-classifier/)的说明来训练自己的物种分类器。我们在[数据资源页面](https://docs.qiime2.org/2021.2/data-resources/)上提供了一些通用的分类器，包括基于Silva的16S分类器，不过将来我们可能会停止提供这些分类器，而让用户训练他们自己的分类器，这将与他们的序列数据最相关。

下载物种注释数据库制作的分类器：无法下载记得后台回复"qiime2"获得备用下载链接

```
# 27M
wget \
  -O "gg-13-8-99-515-806-nb-classifier.qza" \
  "https://data.qiime2.org/2021.2/common/gg-13-8-99-515-806-nb-classifier.qza"

```

物种注释和可视化

```
time qiime feature-classifier classify-sklearn \
  --i-classifier gg-13-8-99-515-806-nb-classifier.qza \
  --i-reads rep-seqs.qza \
  --o-classification taxonomy.qza

qiime metadata tabulate \
  --m-input-file taxonomy.qza \
  --o-visualization taxonomy.qzv

```

详者注：此处用时1分钟，大项目、大数据可能几小时或更长。

**输出结果:**

- taxonomy.qza: 物种注释结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Ftaxonomy.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/taxonomy.qza)
- gg-13-8-99-515-806-nb-classifier.qza: 分类器的训练结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fgg-13-8-99-515-806-nb-classifier.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/gg-13-8-99-515-806-nb-classifier.qza)

**可视化结果:**

- taxonomy.qzv: 物种注释可视化。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Ftaxonomy.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/taxonomy.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.11.jpg)

**图11. md5类型ID对应的物种信息和分类置信度**

> 问题：回想一下，`rep-seqs.qzv`可视化允许你轻松地对NCBI nt数据库BLAST每个特性的序列。使用此处创建的可视化和`taxonomy.qzv`可视化，将几个特性物种分配与最佳BLAST命中的分类进行比较，结果有多相似？如果它们不同，它们在什么分类学层次上开始不同（例如，物种、属、科…）？

接下来，我们可以用交互式条形图查看样本的分类组成。使用以下命令绘图堆叠柱状图，然后打开查看。

```
qiime taxa barplot \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization taxa-bar-plots.qzv
```

结果: 

- taxa-bar-plots.qzv: 交互式物种组成堆叠柱状图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Ftaxa-bar-plots.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/taxa-bar-plots.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.12.jpg)

**图12. 门水平样本堆叠柱状图、按Firmicutes排序**。可切换不同分类级别、选择10余种配色方案；切换排序类型和升降序方向。同时图中的注可鼠标悬停查看数据。

> 问题：在物种注释第二级可视化样本（在本分析中对应于门级别），然后按`body-site`、`subject`、然后按`days-since-experiment-start`对样本进行排序。在`body-site`中不同部位都有哪些优势门类？在`days-since-experiment-start` 0和后面的时间点之间，你是否观察到两个组之间的一致的变化规律呢？

## 使用ANCOM差异丰度分析

**Differential abundance testing with ANCOM**

ANCOM可用于识别不同样本组中丰度差异的特征。与任何生物信息学方法一样，在使用ANCOM之前，你应该了解ANCOM的假设和局限性。我们建议在使用这种方法之前先回顾一下ANCOM的论文 https://www.ncbi.nlm.nih.gov/pubmed/26028277。

> 注意：差异丰度检验在微生物学分析中是一个热门的研究领域。有两个QIIME 2插件可用：`q2-gneiss`和`q2-composition`。本节使用`q2-composition`，但是如果你想了解更多，还有一个教程在另外的数据集上使用`q2-gneiss`，在后面有详细介绍。

ANCOM是在`q2-composition`插件中实现的。ANCOM假设很少（小于约25%）的特征在组之间改变。**如果你期望在组之间有更多的特性正在改变，那么就不应该使用ANCOM**，因为它更容易出错（I类/假阴性和II类/假阳性错误都有可能增加）。因为我们预期身体部位的许多特征都会发生变化，所以在本教程中，我们将过滤完整的特征表后只包含肠道样本。然后，我们将应用ANCOM来确定哪种（如果有的话）序列变体在我们两个受试者的肠道样本中丰度存在差异。

我们将首先创建一个只包含肠道样本的特征表。（要了解关于筛选的更多信息，请参阅[数据筛选教程](https://docs.qiime2.org/2021.2/tutorials/filtering/)。）

```
qiime feature-table filter-samples \
  --i-table table.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-where "[body-site]='gut'" \
  --o-filtered-table gut-table.qza
```

输出对象：
- gut-table.qza：只包含肠道样本的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fgut-table.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/gut-table.qza)

ANCOM基于每个样本的特征频率对`FeatureTable[Composition]`进行操作，但是不能容忍零。为了构建组成composition 对象，必须提供一个添加伪计数`add-pseudocount`（一种遗失值插补方法）的`FeatureTable[Frequency]`对象，这将产生`FeatureTable[Composition]`对象。

```
qiime composition add-pseudocount \
  --i-table gut-table.qza \
  --o-composition-table comp-gut-table.qza
```

输出结果:

- comp-gut-table.qza: 组成型特征表，无零值。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcomp-gut-table.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/comp-gut-table.qza)

接下来可用ANCON对两组的特征进行丰度差异的比较了。

```
time qiime composition ancom \
  --i-table comp-gut-table.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column subject \
  --o-visualization ancom-subject.qzv
```

输出结果:

- `ancom-subject.qzv`: 按Subject分类比较结果。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fancom-subject.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/ancom-subject.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.13.jpg)

**图13. 交互火山图展示组间差异特征**。鼠标悬停在特征点上，可显示特征名称和对应的具体坐标。下面有每个显著差异特征的统计结果，以及组内分位数表格。

> 问题：哪个序列变体(SV)在分组间差异很大？每个SV在哪个分组中更丰富？这些SV的分类是什么？（要回答最后一个问题，你需要参考本教程中物种注释部分生成的另一个可视化。）

我们也经常对在特定的分类学层次上执行差异丰度检验。为此，我们可以在感兴趣的分类级别上折叠`FeatureTable[Frequency]`中的特性，然后重新运行上述步骤。在本教程中，我们将特征表折叠到属级别（即Greengenes分类法的第6级）。

```
qiime taxa collapse \
  --i-table gut-table.qza \
  --i-taxonomy taxonomy.qza \
  --p-level 6 \
  --o-collapsed-table gut-table-l6.qza

qiime composition add-pseudocount \
  --i-table gut-table-l6.qza \
  --o-composition-table comp-gut-table-l6.qza

qiime composition ancom \
  --i-table comp-gut-table-l6.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column subject \
  --o-visualization l6-ancom-subject.qzv
```

**输出对象:**

- gut-table-l6.qza: 按属水平折叠的特征表。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fgut-table-l6.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/gut-table-l6.qza)
- comp-gut-table-l6.qza: 属水平筛选肠样本的相对丰度组成表。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fcomp-gut-table-l6.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/comp-gut-table-l6.qza)

输出可视化结果:

- l6-ancom-Subject.qzv: 属水平差异比较结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fmoving-pictures%2Fl6-ancom-subject.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/moving-pictures/l6-ancom-subject.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.4.14.jpg)

**图14. 交互火山图展示组间差异属**。鼠标悬停在特征点上，可显示属名称和对应的具体坐标。下面表格为每个显著差异属的统计结果，以及组内分位数表格。

> 问题：哪个属在不同组间有丰富的差异？哪一组每个属比较丰富?


## 译者简介

**刘永鑫**，博士，高级工程师，中科院青促会会员，QIIME 2项目参与人。2008年毕业于东北农业大学微生物学专业，2014年于中国科学院大学获生物信息学博士，2016年遗传学博士后出站留所工作，任工程师，研究方向为宏基因组数据分析。目前在***Science、Nature Biotechnology、Protein & Cell、Current Opinion in Microbiology***等杂志发表论文30余篇，被引3千余次。2017年7月创办“宏基因组”公众号，分享宏基因组、扩增子研究相关文章2400余篇，代表作有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、 [《微生物组实验手册》](https://mp.weixin.qq.com/s/PzFglpqW1RwoqTLghpAIbA)、[《微生物组数据分析》](https://mp.weixin.qq.com/s/xHe1FHLm3n0Vkxz0nNbXvQ)等，关注人数11万+，累计阅读2100万+。

## Reference

https://docs.qiime2.org/2021.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

Caporaso, J.G., Lauber, C.L., Costello, E.K., Berg-Lyons, D., Gonzalez, A., Stombaugh, J., Knights, D., Gajer, P., Ravel, J., Fierer, N., Gordon, J.I., and Knight, R. (2011). Moving pictures of the human microbiome. Genome Biology 12, R50.


## 猜你喜欢

- 10000+: [菌群分析](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)  
[宝宝与猫狗](http://mp.weixin.qq.com/s/K3y3an-EaX8iaytmxdzHqA) [提DNA发Nature](http://mp.weixin.qq.com/s/lO5uiMjixJ6aYTjPX-IyaQ) [实验分析谁对结果影响大](http://mp.weixin.qq.com/s/cL_IAoPFfmelKMPMgltrfA)  [Cell微生物专刊](https://mp.weixin.qq.com/s/fN0gpD3bZJDXSp8x4ck-3Q) [肠道指挥大脑](https://mp.weixin.qq.com/s/pZO20VGl3Tf_OtFIbZ-zWw)
- 系列教程：[微生物组入门](http://mp.weixin.qq.com/s/sQyl5EctXFB95Oxg8YIasg) [Biostar](http://mp.weixin.qq.com/s/JL-n2nD6YL8vwuRtTVmQlQ) [微生物组](http://mp.weixin.qq.com/s/li7SdZVaCEyFQF8h6MMh2A)  [宏基因组](http://mp.weixin.qq.com/s/bcyvhFrNr6niqD13rQfZeg) 
- 专业技能：[生信宝典](http://mp.weixin.qq.com/s/2b3_8Vvv7McqCkEfUszW3A) [学术图表](http://mp.weixin.qq.com/s/SCT4oso_vI0UNIJZTaG95g) [高分文章](http://mp.weixin.qq.com/s/kD-x7K4hI5KMgGXikyLt0Q) [不可或缺的人](http://mp.weixin.qq.com/s/1nf7vwyvC3oemkTq_pu87A) 
- 一文读懂：[宏基因组](http://mp.weixin.qq.com/s/Vsm6BJgqsSvxEenIBrGVLw) [寄生虫益处](https://mp.weixin.qq.com/s/hX0K9TOLPnrZ6f8lUoSYag) [进化树](https://mp.weixin.qq.com/s/GV8rU3FZdc8Y-x931k_yrQ)
- 必备技能：[提问](http://mp.weixin.qq.com/s/xCif04bqZB14Z4OvesK0SQ) [搜索](http://mp.weixin.qq.com/s/wn2bqIPgT5UD-GP1qzkJFA)  [Endnote](http://mp.weixin.qq.com/s/SPblPs5ByPdb2C400kIK3w)
- 文献阅读 [热心肠](http://mp.weixin.qq.com/s/1uBeAQ0utxuzTTtfUx_UXA) [SemanticScholar](https://mp.weixin.qq.com/s/gaQiUrRqLpfTXzjyfbua6A) [Geenmedical](https://mp.weixin.qq.com/s/hc8g64aHN7qv8YhVfrsuvQ)
- 扩增子分析：[图表解读](http://mp.weixin.qq.com/s/oiVHO2S1JgYrKXPDU6fH2g) [分析流程](http://mp.weixin.qq.com/s/KrYyy3jjzAL0rQzVfV6h4A) [统计绘图](http://mp.weixin.qq.com/s/6tNePiaDsPPzEBZjiCXIRg) 
- [16S功能预测](http://mp.weixin.qq.com/s/sztbvfdf9wa-3HJXc_m8TQ)   [PICRUSt](https://mp.weixin.qq.com/s/LWtiwBbUCAadMZPaKKDMag)  [FAPROTAX](http://mp.weixin.qq.com/s/J8EwJD_PTDhqRaD7kXlK1A)  [Bugbase](https://mp.weixin.qq.com/s/1WdysPZWo0H6NSYiNpcMUQ) [Tax4Fun](http://mp.weixin.qq.com/s/dzsh44ue93xnAs7gTde7wg)
- 在线工具：[16S预测培养基](http://mp.weixin.qq.com/s/YIrDqNvDX0XMazCGxhH1Lg) [生信绘图](http://mp.weixin.qq.com/s/O0QAQyfxnrXlFLw268B7lg)
- 科研经验：[云笔记](http://mp.weixin.qq.com/s/OnwhWlq3cTycf-W1rxgV7g)  [云协作](http://mp.weixin.qq.com/s/W5By9mZ5PI57_xFfZ_JXiw) [公众号](http://mp.weixin.qq.com/s/hd0sdBDAMqMJsXQs0pIjUg)
- 编程模板: [Shell](http://mp.weixin.qq.com/s/YevGR79NnBAF-xtrqL8gAA)  [R](http://mp.weixin.qq.com/s/OQiE882jM6pVwqTiIjyZ1Q) [Perl](http://mp.weixin.qq.com/s/u2ZmTo-z6cbN-L6KVLYNwg) 
- 生物科普: [肠道细菌](http://mp.weixin.qq.com/s/3T768LA6MWujF4yuzK4MKQ) [人体上的生命](http://mp.weixin.qq.com/s/_DUI6tOYTEq0Wu7K7iRTxw) [生命大跃进](http://mp.weixin.qq.com/s/O_0Il0G_v_aSwkUH_noZVA)  [细胞暗战](http://mp.weixin.qq.com/s/M35ebWAelDIK5Iqib06JzA) [人体奥秘](https://mp.weixin.qq.com/s/xlCdN8il1hcutkYK-42fAQ)  


## 写在后面

为鼓励读者交流、快速解决科研困难，我们建立了“宏基因组”专业讨论群，目前己有国内外5000+ 一线科研人员加入。参与讨论，获得专业解答，欢迎分享此文至朋友圈，并扫码加主编好友带你入群，务必备注“姓名-单位-研究方向-职称/年级”。技术问题寻求帮助，首先阅读[《如何优雅的提问》](http://mp.weixin.qq.com/s/H9gkepap0hy3NNskOkO44w)学习解决问题思路，仍末解决群内讨论，问题不私聊，帮助同行。
![image](http://bailab.genetics.ac.cn/markdown/life/yongxinliu.jpg)

学习扩增子、宏基因组科研思路和分析实战，关注“宏基因组”
![image](http://bailab.genetics.ac.cn/markdown/life/metagenome.jpg)

![image](http://bailab.genetics.ac.cn/markdown/train/1809/201807.jpg)

点击阅读原文，跳转最新文章目录阅读
https://mp.weixin.qq.com/s/5jQspEvH5_4Xmart22gjMA
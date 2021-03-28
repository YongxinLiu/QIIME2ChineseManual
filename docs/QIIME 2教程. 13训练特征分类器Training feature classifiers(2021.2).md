[TOC]

# 训练特征分类器

**Training feature classifiers with q2-feature-classifier**

https://docs.qiime2.org/2021.2/tutorials/feature-classifier/

> 注：最好按本教程顺序学习，想直接学习本章，至少完成本系列[1简介和安装](https://mp.weixin.qq.com/s/sX7ab7ff_H6dyLwwjuYFjA)。

> 详者注：为什么要训练分类集？
因为不同实验的扩增区域不同，鉴定物种分类的精度不同，提前的训练可以让分类结果更准确。但目前ITS区域训练对结果准确性提高不大，可以不用训练。

本教程将演示如何为特定数据集训练`q2-feature-classifier`。我们将使用`Greengenes`参考数据库序列来训练`Naive Bayes`分类器，并从[《4人体各部位微生物组分析》](https://mp.weixin.qq.com/s/Stlb1ri6W7aSOF2rX2ru1A)中获得的代表性序列进行分类。

请注意，QIIME 2数据资源中提供了几个经过预先训练的分类器。这些基因可用于一些常见的标记基因（如16S rRNA基因）注释。其他标记基因的预训练分类器也可以在QIIME2论坛上找到。详见 https://docs.qiime2.org/2021.2/data-resources/ ，**里面有Silva和Greengenes的全长和V4区的分类器供下载直接使用**。

## 下载并导入参考序列

**Obtaining and importing reference data sets**

这里我们使用`85_otus.fasta`(按85%相似度聚类)的文件用于演示，是**因为体积小运行更快。实际中大家一般使用参考序列99%和97%聚类的结果用于分类**。如果你的电脑或服务器配置太低无法运行，可选择更低聚类的结果文件用于分析。

```
# 创建工作目录
mkdir -p training-feature-classifiers
cd training-feature-classifiers

# 下载参考OTU数据集，7M
wget -c https://data.qiime2.org/2021.2/tutorials/training-feature-classifiers/85_otus.fasta

# 下载参考数据集的物种分类信息，442K
wget -c https://data.qiime2.org/2021.2/tutorials/training-feature-classifiers/85_otu_taxonomy.txt

# 下载代表性序列文件，1.7M
wget -c https://data.qiime2.org/2021.2/tutorials/training-feature-classifiers/rep-seqs.qza
```

接下来，我们将这些数据导入到QIIME 2对象中。由于Greengenes序列物种注释文件（`85_otu_Taxonomy.txt`）是一个不带标题的制表符分隔文件（tsv），因此必须指定`HeaderlessTSVTaxonomyFormat`作为源格式，因为默认源格式需要标题。

```
# 导入参考序列
qiime tools import \
  --type 'FeatureData[Sequence]' \
  --input-path 85_otus.fasta \
  --output-path 85_otus.qza

# 导入物种分类信息
qiime tools import \
  --type 'FeatureData[Taxonomy]' \
  --input-format HeaderlessTSVTaxonomyFormat \
  --input-path 85_otu_taxonomy.txt \
  --output-path ref-taxonomy.qza
```

**输出对象**：

- `85_otus.qza`: 按85%聚类的参考数据库。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Ffeature-classifier%2F85_otus.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/feature-classifier/85_otus.qza)
- `rep-seqs.qza`: 预训练的参考数据库。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Ffeature-classifier%2Frep-seqs.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/feature-classifier/rep-seqs.qza)
- `ref-taxonomy.qza`: 按85%聚类的参考数据库。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Ffeature-classifier%2Fref-taxonomy.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/feature-classifier/ref-taxonomy.qza)

## 提取参考序列

**Extract reference reads**

[2012年Werner等人研究表明](https://www.ncbi.nlm.nih.gov/pubmed/21716311)，当一个朴素贝叶斯(Naive Bayes)分类器只训练被测序的目标序列的区域时，16S rRNA基因序列的分类准确度会提高。这种策略不一定对其他标记基因同样有效（见下文真菌分类注释）。我们从[《4人体各部位微生物组分析》](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)教程中知道，我们试图对序列进行分类的是120个碱基的单端序列，这些读长是用515F/806R引物对16S rRNA基因序列进行扩增的产物。我们在这里通过从参考数据库中提取基于与该对引物匹配的区域，然后将结果截取至120个碱基来对此进行优化。

```
# 按我们测序的引物来提取参考序列中的一段，1m
time qiime feature-classifier extract-reads \
  --i-sequences 85_otus.qza \
  --p-f-primer GTGCCAGCMGCCGCGGTAA \
  --p-r-primer GGACTACHVGGGTWTCTAAT \
  --p-trunc-len 120 \
  --p-min-length 100 \
  --p-max-length 400 \
  --o-reads ref-seqs.qza
```

**输出对象**：

- `ref-seqs.qza`: 提取的扩增区域。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Ffeature-classifier%2Fref-seqs.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/feature-classifier/ref-seqs.qza)

> 注释：`-p-trunc-len`参数只能用于比对序列被剪裁成相同长度或更短的长度时，才需要剪裁参考序列。成功双端合并序列的长度通常是可变的。未在特定长度截断的单端读取的长度也可能是可变的。对于双端和未经修剪的单端读的物种分类，我们建议对在适当的引物位置提取但不修剪为等长的序列进行分类器训练。

> 注释：用于提取扩增区域的引物序列应该是包含在引物结构中的实际DNA结合（即生物）序列。它不应包含任何非生物、非匹配的序列，例如接头、连接物或条形码序列。如果你不确定你的引物序列的哪个部分是真正的DNA结合区域，你应该咨询为你构建测序文库的工程师，你选择的测序中心，或者这些引物的原始文献。如果你的引物序列长度大于30nt，它们很可能包含一些非生物序列。

> 注释：上面的示例命令使用`min-length`和`max-length`参数，来排除使用这些引物远远超出预期长度分布的模拟扩增结果。这样的扩增产物可能是非特异性扩增，应该排除。如果您将此命令调整为自己的项目中使用，请确保选择适合标记基因，而不是此处使用序列或参数。`min-length`参数在`trim-left`和`trunc-len`参数之后应用，在`max-length`之前应用，因此一定要设置适当的设置，以防止有效序列被过滤掉。

## 训练分类集

**Train the classifier**

我们将使用下面的命令训练[Naive Bayes分类器](http://scikit-learn.org/stable/modules/naive_bayes.html#multinomial-naive-bayes)

```
# 基于筛选的指定区段，生成实验特异的分类集，18s
time qiime feature-classifier fit-classifier-naive-bayes \
  --i-reference-reads ref-seqs.qza \
  --i-reference-taxonomy ref-taxonomy.qza \
  --o-classifier classifier.qza
```

**输出对象**：

- `classifier.qza`: 生成分类器文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Ffeature-classifier%2Fclassifier.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/feature-classifier/classifier.qza)

## 测试分类集

**Test the classifier**

下面我们使用训练好的分析器，对[《4人体各部位微生物组分析Moving Pictures》](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)中的代表序列进行物种注释。

```
# 使用训练后的分类集对结果进行注释, 21s
time qiime feature-classifier classify-sklearn \
  --i-classifier classifier.qza \
  --i-reads rep-seqs.qza \
  --o-classification taxonomy.qza

# 可视化注释的结果, 6s
time qiime metadata tabulate \
  --m-input-file taxonomy.qza \
  --o-visualization taxonomy.qzv
```

**输出对象**：

- `taxonomy.qza`: 生成物种注释结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Ffeature-classifier%2Ftaxonomy.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/feature-classifier/taxonomy.qza)

**输出可视化**：

- `taxonomy.qzv`: 生成物种注释可视化网页结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Ffeature-classifier%2Ftaxonomy.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/feature-classifier/taxonomy.qzv)

![image](http://bailab.genetics.ac.cn/markdown/QIIME2/80_classify.jpg)

感兴趣的朋友，可以拿这个训练后的结果，和之前的比较。看看有什么变化？

## 分类真菌ITS序列

**Classification of fungal ITS sequences**

根据我们的经验，在[Unite参考数据库](https://unite.ut.ee/repository.php)上训练的Fungal ITS分类器不会从提取/修剪引物扩增区域的方法中改善结果。我们建议在完整参考序列上训练Unite分类器。此外，我们推荐使用“developer”版本序列（位于qiime兼容版本下载中），因为标准版序列的已经被修剪到指定区域（不包括可能存在于标准引物产生的扩增子中的侧翼rRNA基因的部分）。

## 译者简介

## 译者简介

**刘永鑫**，博士，高级工程师，中科院青促会会员，QIIME 2项目参与人。2008年毕业于东北农业大学微生物学专业，2014年于中国科学院大学获生物信息学博士，2016年遗传学博士后出站留所工作，任工程师，研究方向为宏基因组数据分析。目前在***Science、Nature Biotechnology、Protein & Cell、Current Opinion in Microbiology***等杂志发表论文30余篇，被引3千余次。2017年7月创办“宏基因组”公众号，分享宏基因组、扩增子研究相关文章2400余篇，代表作有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、 [《微生物组实验手册》](https://mp.weixin.qq.com/s/PzFglpqW1RwoqTLghpAIbA)、[《微生物组数据分析》](https://mp.weixin.qq.com/s/xHe1FHLm3n0Vkxz0nNbXvQ)等，关注人数11万+，累计阅读2100万+。

## Reference

https://docs.qiime2.org/2021.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

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

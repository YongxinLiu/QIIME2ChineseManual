[TOC]

# 前情提要

- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)
- [Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DhecHNqv4UjYpVEu48oXAw)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/cqzpLOprpClaib1FvH7bjg)
- [Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/PHpg0y6_mydtCXYUwZa2Yg)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/tmXAjkl7oW3X4uagLOJu2A)
- [mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/3tF6_CfSKBbtLQU4G3NpEQ)
- [7帕金森小鼠教程Parkinson's Mouse](https://mp.weixin.qq.com/s/cN1sfcWFME7S4OJy4VIREg)
- [Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/OINhALYIaH-JZICpU68icQ)
- [8差异丰度分析gneiss](https://mp.weixin.qq.com/s/wx9dr5e2B_YyqTdPJ7dVsQ)
- [9数据导入Importing data](https://mp.weixin.qq.com/s/u0k38x4lAUaghua2FDD1mQ)
- [10数据导出Exporting data](https://mp.weixin.qq.com/s/pDxDsm8vabpe9KtcLRYWxg)
- [11元数据Metadata](https://mp.weixin.qq.com/s/Q-YTeXH84lgBbRwuzc1bsg)
- [12数据筛选Filtering data](https://mp.weixin.qq.com/s/zk-pXJs4GNwb1AOBPzCaHA)
- [13训练特征分类器Training feature classifiers](https://mp.weixin.qq.com/s/jTRUYgacH5WszsHJVbbh4g)
- [14数据评估和质控Evaluating and controlling](https://mp.weixin.qq.com/s/1b3Hj23bKWfTkHKAPNmCBQ)
- [15样品分类和回归q2-sample-classifier](https://mp.weixin.qq.com/s/3DGvuD3R9atSoo2CSrUJBw)
- [16纵向和成对样本比较q2-longitudinal](https://mp.weixin.qq.com/s/RhRXoGqVuLumxvbba7GgSg)
- [17鉴定和过滤嵌合体序列q2-vsearch](https://mp.weixin.qq.com/s/4FvR7qGTfVFdSkdKtR6_LQ)
- [18序列双端合并read-joining](https://mp.weixin.qq.com/s/xjl41rAlqMwyZSoPBX6Tww)
- [19使用q2-vsearch聚类OTUs](https://mp.weixin.qq.com/s/LewtnbZlJNHw9M8Bakuyeg)
- [20实用程序Utilities](https://mp.weixin.qq.com/s/kSuK4njtfGN_Ph9rmF88Lw)

# 使用q2-phylogeny进行系统发育推断

**Phylogenetic inference with q2-phylogeny**

https://docs.qiime2.org/2020.2/tutorials/phylogeny/

开始本节分析前，我们假定你已经完成了前面内容的学习。

在QIIME 2中可用的几个下游多样性指标要求使用正在研究的操作分类单位（OTU）或精确序列变体（ESV，也叫扩增序列变体ASV）来构建系统树。

但是，我们如何从序列数据中构建系统发育？

好了，我们可以使用两种基于系统发育的方法。使用哪种决定，很大程度上取决于您的科学问题：

1. [基于参考的片段插入方法(A reference-based fragment insertion approach)](https://doi.org/10.1128/mSystems.00021-18)。这可能是理想的选择。特别是，如果您的参考系统发育史（和相关的代表性序列）包含您的序列可以被可靠地插入邻近的亲戚。不会插入与参考的匹配程度不高的任何序列。例如，如果您的数据包含在参考系统发育中未很好表示的序列（例如丢失的进化枝等），则此方法可能无法很好地工作。有关更多信息，请查看这些[出色的片段插入示例](https://library.qiime2.org/plugins/q2-fragment-insertion/16/)。

2. 从头开始。可以在不同分类单元中全局比对的标记基因通常适合通过这种方法进行序列比对和系统发育研究。在构建从头系统发育史时，请注意序列的长度，短读可能会导致缺乏足够的系统发育信息以捕获有意义的系统发育。本社区教程将重点介绍从头方法。

在这里，您将学习如何使用从头系统发育方法来：

1. 在QIIME 2中生成多序列对齐文件
2. 如果需要，遮罩对齐中的非保守区
3. 构造系统发育树
4. 确定系统发育树的根

如果您想通过使用QIIME 2外部的工具来替代此处概述的任何步骤，请在适当的地方查看[9数据导入Importing data](https://mp.weixin.qq.com/s/u0k38x4lAUaghua2FDD1mQ)，[10数据导出Exporting data](https://mp.weixin.qq.com/s/pDxDsm8vabpe9KtcLRYWxg)和[12数据筛选Filtering data](https://mp.weixin.qq.com/s/zk-pXJs4GNwb1AOBPzCaHA)文档。

## 序列对齐Sequence Alignment

在构建[系统发育](https://simple.wikipedia.org/wiki/Phylogeny)之前，我们必须生成[多序列比对（multiple sequence alignment，MSA）](https://en.wikipedia.org/wiki/Multiple_sequence_alignment)。 在构建MSA时，我们将通过其[序列相似性](https://doi.org/10.1002/0471250953.bi0301s42)来说明比对残基（MSA列）的[推定同源性](https://doi.org/10.1006/mpev.2000.0785)。

构建MSA的算法数量众多。 我们将通过[q2-alignment](https://docs.qiime2.org/2020.2/plugins/available/alignment/)插件使用[MAFFT（使用快速傅里叶变换的多重对齐）](https://en.wikipedia.org/wiki/MAFFT)。 有关更多信息，请查看[MAFFT的文章](https://doi.org/10.1093/molbev/mst010)。

首先，创建一个工作目录：

    mkdir -p qiime2-phylogeny-tutorial
    cd qiime2-phylogeny-tutorial

下载代表序列 

    wget -c "https://data.qiime2.org/2020.2/tutorials/phylogeny/rep-seqs.qza" \
      -O "rep-seqs.qza"

运行MAFFT

    # 6s
    time qiime alignment mafft \
      --i-sequences rep-seqs.qza \
      --o-alignment aligned-rep-seqs.qza

输出对象：
- `rep-seqs.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Frep-seqs.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/rep-seqs.qza)
- `aligned-rep-seqs.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Faligned-rep-seqs.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/aligned-rep-seqs.qza)


## 减少对齐的歧义：屏蔽和参考对齐方式 Reducing alignment ambiguity: masking and reference alignments

为什么要屏蔽(mask)序列？

屏蔽/掩码有助于消除在系统发育分析之前系统发育上无用或误导的比对列。 许多时间对准误差会引入噪声并混淆系统发育推断。 在执行系统发生推断之前，通常会屏蔽（删除）这些歧义对齐的区域。 特别是，David Lane（1991）的[16S / 23S rRNA测序](http://catdir.loc.gov/catdir/toc/onix05/90012998.html)建议在系统发育分析之前屏蔽SSU数据。 但是，知道如何处理歧义对齐的区域以及何时使用屏蔽很大程度上取决于要分析的标志物基因和数据需要回答的科学问题。

> 注意
> 
> 请记住，这仍然是一个活跃的讨论领域，以下非详尽的文章清单突显了这一点：[Wu等2012年](https://doi.org/10.1371/journal.pone.0030288)，[Ashkenazy等人2018年](https://doi.org/10.1093/sysbio/syy036)，[Schloss 2010年](https://doi.org/10.1371/journal.pcbi.1000844)，[Tan等人2015年](https://doi.org/10.1093/sysbio/syv033)，[Rajan2015年](https://doi.org/10.1093/sysbio/syv033)。

如何屏蔽序列呢？

为了我们的目的，我们假设在上面生成的MAFFT对齐方式中存在不确定的对齐列。 屏蔽对齐默认设置`--p-min-conservation`接近QIIME 1的Lane mask。请密切注意对齐插件的更新。

    # 6s
    time qiime alignment mask \
      --i-alignment aligned-rep-seqs.qza \
      --o-masked-alignment masked-aligned-rep-seqs.qza
  
输出对象：
- `masked-aligned-rep-seqs.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fmasked-aligned-rep-seqs.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/masked-aligned-rep-seqs.qza)

基于参考的多序列比对(Reference based alignments)

有多种工具，例如[PyNAST](https://doi.org/10.1093/bioinformatics/btp636)（使用[NAST](https://doi.org/10.1093/nar/gkl244)），[Infernal](https://doi.org/10.1093/bioinformatics/btt509)和[SINA](https://doi.org/10.1093/bioinformatics/bts252)等，它们试图通过使用校对的参考比对（例如[SILVA](https://www.arb-silva.de/)）来减少歧义比对区域的数量。参考比对对rRNA基因特别有效序列数据，因为将二级结构的知识整合到了校对过程中，从而提高了比对质量。有关基于参考的比对方法更深入，更有说服力的概述，请查看[SINA社区教程](https://forum.qiime2.org/t/q2-alignment-reference-based-alignment-using-sina/6220)。

> 注意
> 
> 就像上面的MAFFT示例一样，使用基于参考的对齐方式构造的对齐方式也可以被屏蔽。 同样，我们在此处讨论的参考对齐方法与我们之前提到的参考系统发生方法（即[q2-fragment-insertion](https://docs.qiime2.org/2020.2/plugins/available/fragment-insertion/)）不同。 也就是说，我们不是将数据插入到现有的树中，而只是试图创建更健壮的比对，以实现更好的从头系统发育。

## 构建系统发育 Construct a phylogeny

与MSA算法一样，系统发育推断工具也很丰富。 幸运的是，有很多很棒的资源可以学习系统发育学。 以下是一些入门资源，可帮助您入门：

1. [系统发育学入门教程](https://doi.org/10.1016/S0168-9525(03)00112-4)
2. [分子系统发育学-原理与实践](https://dx.doi.org/10.1038/nrg3186)
3. [系统发育学-简介](https://www.ebi.ac.uk/training/online/course/introduction-phylogenetics)

qiime2：的 `q2-phylogeny` 插件中提供了几种方法/流程。 这些基于以下工具：

1. [FastTree](https://doi.org/10.1371/journal.pone.0009490)
2. [RAxML](https://doi.org/10.1093/bioinformatics/btu033)
3. [IQ-TREE](https://doi.org/10.1093/molbev/msu300)

# 方法Methods

## fasttree

FastTree能够从大型序列比对中快速构建系统发育。 它通过使用[CAT-like](https://doi.org/10.1109/IPDPS.2006.1639535)的速率类别近似值来实现此目的，该近似值也可以通过RAxML获得（如下所述）。 查阅[FastTree在线手册](http://www.microbesonline.org/fasttree/)以获取更多信息。

    # 6s
    time qiime phylogeny fasttree \
      --i-alignment masked-aligned-rep-seqs.qza \
      --o-tree fasttree-tree.qza

输出对象：
- `fasttree-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Ffasttree-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/fasttree-tree.qza)

> 小贴示：为了方便而直接地查看您的`tree.qza`文件，请将它们上传到[iTOL](https://itol.embl.de/)。 在这里，您可以交互地查看和操纵系统发育树。 更好的是，在“正常模式”下查看树拓扑时，您可以将关联的`alignment.qza`（用于构建系统发育的那个）或相关的`taxonomy.qza`文件拖放到iTOL树可视化中。 这将允许您直接查看序列比对或分类学以及系统发育。 🕶️

> 译者测试itol对QIIME 2的qza格式的支持情况和展示效果。

> 访问ttps://itol.embl.de/，注册账号登陆。上传树文件`fasttree-tree.qza`

![image](http://210.75.224.110/github/QIIME2ChineseManual/fig/2020.2/phylogeny.itol1.jpg)

> 拖拽`aligned-rep-seqs.qza`至树上展示

![image](http://210.75.224.110/github/QIIME2ChineseManual/fig/2020.2/phylogeny.itol2.jpg)

更多itol的使用，详见 - [iTOL美化](https://mp.weixin.qq.com/s/htW2nWJBCp555y27grrGRw) [进阶](https://mp.weixin.qq.com/s/ZATPWf47WBKl91gFEBzusg)  

## raxml

像fasttree一样，raxml将执行单个系统发育推断并返回一棵树。 注意，raxml的默认模型是`--p-substitution-model GTRGAMMA`。 如果您想使用像fasttree这样的CAT模型来构建树，只需将GTRGAMMA替换为GTRCAT，如下所示：

    # 6s
    time qiime phylogeny raxml \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-substitution-model GTRCAT \
      --o-tree raxml-cat-tree.qza \
      --verbose

正常是显示如下结果：

    Running external command line application. This may print messages to stdout and/or stderr.
    The command being run is below. This command cannot be manually re-run as it will depend on temporary files that no longer exist.
    
    Command: raxmlHPC -m GTRCAT -p 6837 -N 1 -s /tmp/qiime2-archive-f7qd3egy/0f292022-14c0-431e-83ea-87e07fa04b35/data/aligned-dna-sequences.fasta -w /tmp/tmpscvv747b -n q2
    
    Warning, you specified a working directory via "-w"
    Keep in mind that RAxML only accepts absolute path names, not relative ones!
    
    RAxML can't, parse the alignment file as phylip file 
    it will now try to parse it as FASTA file
    
    
    
    Using BFGS method to optimize GTR rate parameters, to disable this specify "--no-bfgs" 
    
    
    
    This is RAxML version 8.2.12 released by Alexandros Stamatakis on May 2018.
    
    With greatly appreciated code contributions by:
    Andre Aberer      (HITS)
    Simon Berger      (HITS)
    Alexey Kozlov     (HITS)
    Kassian Kobert    (HITS)
    David Dao         (KIT and HITS)
    Sarah Lutteropp   (KIT and HITS)
    Nick Pattengale   (Sandia)
    Wayne Pfeiffer    (SDSC)
    Akifumi S. Tanabe (NRIFS)
    Charlie Taylor    (UF)
    
    
    Alignment has 157 distinct alignment patterns
    
    Proportion of gaps and completely undetermined characters in this alignment: 39.77%
    
    RAxML rapid hill-climbing mode
    
    Using 1 distinct models/data partitions with joint branch length optimization
    
    
    Executing 1 inferences on the original alignment using 1 distinct randomized MP trees
    
    All free model parameters will be estimated by RAxML
    ML estimate of 25 per site rate categories
    
    Likelihood of final tree will be evaluated and optimized under GAMMA
    
    GAMMA Model parameters will be estimated up to an accuracy of 0.1000000000 Log Likelihood units
    
    Partition: 0
    Alignment Patterns: 157
    Name: No Name Provided
    DataType: DNA
    Substitution Matrix: GTR
    
    
    
    
    RAxML was called as follows:
    
    raxmlHPC -m GTRCAT -p 6837 -N 1 -s /tmp/qiime2-archive-f7qd3egy/0f292022-14c0-431e-83ea-87e07fa04b35/data/aligned-dna-sequences.fasta -w /tmp/tmpscvv747b -n q2 
    
    
    Partition: 0 with name: No Name Provided
    Base frequencies: 0.243 0.182 0.319 0.256 
    
    Inference[0]: Time 1.304490 CAT-based likelihood -1246.372627, best rearrangement setting 5
    
    
    Conducting final model optimizations on all 1 trees under GAMMA-based models ....
    
    Inference[0] final GAMMA-based Likelihood: -1393.280071 tree written to file /tmp/tmpscvv747b/RAxML_result.q2
    
    
    Starting final GAMMA-based thorough Optimization on tree 0 likelihood -1393.280071 .... 
    
    Final GAMMA-based Score of best tree -1387.733722
    
    Program execution info written to /tmp/tmpscvv747b/RAxML_info.q2
    Best-scoring ML tree written to: /tmp/tmpscvv747b/RAxML_bestTree.q2
    
    Overall execution time: 2.139081 secs or 0.000594 hours or 0.000025 days
    
    Saved Phylogeny[Unrooted] to: raxml-cat-tree.qza

**输出对象：**
- `raxml-cat-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fraxml-cat-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/raxml-cat-tree.qza)

详者注：如果分析中报错，可能是环境变量污染，可以退出环境。重新登陆termail，再加载qiime2环境重试。

### 使用raxml执行多次搜索 Perform multiple searches using raxml

如果您想对“树空间(tree space)”执行更彻底的搜索，则可以使用`--pn-searches 5`指示raxml对完全对齐执行多个独立搜索。一旦完成这5个独立搜索，则仅执行一次最佳搜索 得分树将被返回。 *请注意，我们不在这里进行自展支持率的计算，我们将在以后的示例中进行介绍*。 让我们设置`--p-substitution-model GTRCAT`。 最后，我们还要通过`--p-seed`手动设置种子。 通过设置我们的种子，我们允许其他用户可以重复出我们的系统发育树。 也就是说，任何使用相同序列比对和替换模型的人，只要设置了相同的种子值，都将生成相同的树。 尽管`--p-seed`不是必需的参数，但是设置此值通常是一个好主意。

    # 13s
    time qiime phylogeny raxml \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-substitution-model GTRCAT \
      --p-seed 1723 \
      --p-n-searches 5 \
      --o-tree raxml-cat-searches-tree.qza \
      --verbose

输出内容如下：

    Running external command line application. This may print messages to stdout and/or stderr.
    The command being run is below. This command cannot be manually re-run as it will depend on temporary files that no longer exist.
    
    Command: raxmlHPC -m GTRCAT -p 1723 -N 5 -s /tmp/qiime2-archive-5mraa_k4/0f292022-14c0-431e-83ea-87e07fa04b35/data/aligned-dna-sequences.fasta -w /tmp/tmp9k6jpgh5 -n q2
    
    Warning, you specified a working directory via "-w"
    Keep in mind that RAxML only accepts absolute path names, not relative ones!
    
    RAxML can't, parse the alignment file as phylip file 
    it will now try to parse it as FASTA file
    
    Using BFGS method to optimize GTR rate parameters, to disable this specify "--no-bfgs" 
    
    This is RAxML version 8.2.12 released by Alexandros Stamatakis on May 2018.
    
    With greatly appreciated code contributions by:
    Andre Aberer      (HITS)
    ...
    Charlie Taylor    (UF)
    
    Alignment has 157 distinct alignment patterns
    
    Proportion of gaps and completely undetermined characters in this alignment: 39.77%
    
    RAxML rapid hill-climbing mode
    
    Using 1 distinct models/data partitions with joint branch length optimization
    
    Executing 5 inferences on the original alignment using 5 distinct randomized MP trees
    
    All free model parameters will be estimated by RAxML
    ML estimate of 25 per site rate categories
    
    Likelihood of final tree will be evaluated and optimized under GAMMA
    
    GAMMA Model parameters will be estimated up to an accuracy of 0.1000000000 Log Likelihood units
    
    Partition: 0
    Alignment Patterns: 157
    Name: No Name Provided
    DataType: DNA
    Substitution Matrix: GTR
    
    RAxML was called as follows:
    
    raxmlHPC -m GTRCAT -p 1723 -N 5 -s /tmp/qiime2-archive-5mraa_k4/0f292022-14c0-431e-83ea-87e07fa04b35/data/aligned-dna-sequences.fasta -w /tmp/tmp9k6jpgh5 -n q2 
    
    
    Partition: 0 with name: No Name Provided
    Base frequencies: 0.243 0.182 0.319 0.256 
    
    Inference[0]: Time 1.251481 CAT-based likelihood -1238.242991, best rearrangement setting 5
    ...
    Inference[4]: Time 0.884891 CAT-based likelihood -1261.321621, best rearrangement setting 5
    
    
    Conducting final model optimizations on all 5 trees under GAMMA-based models ....
    
    Inference[0] final GAMMA-based Likelihood: -1388.324040 tree written to file /tmp/tmp9k6jpgh5/RAxML_result.q2.RUN.0
    ...
    Inference[4] final GAMMA-based Likelihood: -1387.557824 tree written to file /tmp/tmp9k6jpgh5/RAxML_result.q2.RUN.4
    
    
    Starting final GAMMA-based thorough Optimization on tree 4 likelihood -1387.557824 .... 
    
    Final GAMMA-based Score of best tree -1387.385915
    
    Program execution info written to /tmp/tmp9k6jpgh5/RAxML_info.q2
    Best-scoring ML tree written to: /tmp/tmp9k6jpgh5/RAxML_bestTree.q2
    
    Overall execution time: 6.214823 secs or 0.001726 hours or 0.000072 days
    
    Saved Phylogeny[Unrooted] to: raxml-cat-searches-tree.qza

**输出对象：**
- `raxml-cat-searches-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fraxml-cat-searches-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/raxml-cat-searches-tree.qza)

### 快速自展 raxml-rapid-bootstrap

在系统发育学中，优良作法是检查系统发育中的[分开(splits)/分为两部分(bipartitions)](https://en.wikipedia.org/wiki/Split_(phylogenetics))受支持的程度。人们通常对进化史中哪些进化枝与其他进化枝牢固地分离感兴趣。一种方法是通过自展(bootstrapping)（请参见上面第一个介绍性链接的“自展”部分）。在QIIME 2中，我们提供了对RAxML[快速自展](https://dx.doi.org/10.1080/10635150802429642)功能。该命令与前一个命令的唯一区别是附加标志`--p-bootstrap-replicates`和`--p-rapid-bootstrap-seed`。执行100-1000个自展程序重复的任何位置都是很常见的。 `--p-rapid-bootstrap-seed`的工作原理与上面的`--p-seed`参数非常相似，不同之处在于，它允许任何人重现自展过程以及对分离的相关支持。

根据[RAxML在线文档](https://sco.h-its.org/exelixis/web/software/raxml/hands_on.html)和[RAxML手册](https://sco.h-its.org/exelixis/resource/download/NewManual.pdf)，我们将在下面执行的快速自展命令将执行以下操作：

1. 自展输入对齐方式100次，并对每一次执行最大似然（ML）搜索。
2. 使用原始输入对齐方式，通过多次独立搜索找到最佳评分的ML树。独立搜索的数量由第一步中设置的引导复制数量决定。也就是说，随着引导复制的增加，您的搜索将变得更加彻底。
3. RAxML的ML优化使用每5个自展树作为原始树的ML搜索的起始树。

将两部分（自展支持率，第一步）映射到得分最高的ML树（第二步）上。

    # 39s
    time qiime phylogeny raxml-rapid-bootstrap \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-seed 1723 \
      --p-rapid-bootstrap-seed 9384 \
      --p-bootstrap-replicates 100 \
      --p-substitution-model GTRCAT \
      --o-tree raxml-cat-bootstrap-tree.qza \
      --verbose

显示如下结果：

    Time for BS model parameter optimization 0.106221
    Bootstrap[0]: Time 0.340991 seconds, bootstrap likelihood -1199.758796, best rearrangement setting 12
    Bootstrap[1]: Time 0.221361 seconds, bootstrap likelihood -1344.229251, best rearrangement setting 6
    ...
    Bootstrap[99]: Time 0.108568 seconds, bootstrap likelihood -1270.157811, best rearrangement setting 7
    Saved Phylogeny[Unrooted] to: raxml-cat-bootstrap-tree.qza

**输出对象：**
- `raxml-cat-bootstrap-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fraxml-cat-bootstrap-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/raxml-cat-bootstrap-tree.qza)

> 小贴示：优化RAxML运行时间。您可能已经注意到，我们尚未在RAxML方法中添加标志`--p-raxml-version`。该参数提供了一种访问RAxML版本的方法，该版本具有针对各种现代x86处理器体系结构进行了优化的矢量指令。摘自RAxML手册和帮助文档：首先，最新的处理器将支持SSE3矢量指令（即可能支持更快的AVX2矢量指令）。其次，这些指令将大大加速似然性和简约计算。通常，SSE3版本的运行速度比标准版本快40％。 AVX2版本的运行速度比SSE3版本快10-30％。此外，请记住，使用更多的内核/线程并不一定会减少运行时间。 RAxML手册建议每500个DNA比对模式使用1个核心。使用`--verbose`选项时，对齐模式信息通常在屏幕上可见。另外，尝试使用速率类别（CAT模型；通过`--p-substitution-model`），其结果与GAMMA模型一样好，并且速度快了大约4倍。请参阅[CAT论文](https://doi.org/10.1109/IPDPS.2006.1639535)。 CAT近似也非常适合包含[10,000个或更多类群的比对](https://doi.org/10.1186/1471-2105-12-470)，并且与[FastTree2的类似CAT的模型](https://doi.org/10.1371/journal.pone.0009490)非常相似。

## iqtree

与上面的`raxml`和`raxml-rapid-bootstrap`方法类似，我们为[IQ-TREE](https://doi.org/10.1093/molbev/msu300)提供了类似的功能：`iqtree`和`iqtree-ultrafast-bootstrap`。 与`fastree`和`raxml`选项相比，IQ-TREE的独特之处在于它可以访问286个核苷酸取代模型。 IQ-TREE还可以通过其内置的ModelFinder算法在构建树之前确定其中哪个模型最适合您的数据集。 这是QIIME 2中的默认设置，但请放心，您可以通过--p-substitution-model标志设置286个[核苷酸替换模型](https://doi.org/10.1016/j.dci.2004.07.007)中的任何一个，例如 您可以将模型设置为`HKY+I+G`，而不是默认的`MFP`（基本的简写：“在确定由ModelFinder确定的最佳拟合模型后建立系统发育”）。 请记住，通过ModelFinder进行模型测试所需的额外计算时间。

使用默认设置和自动模型选择（`MFP`）运行[iqtree命令](https://docs.qiime2.org/2020.2/plugins/available/phylogeny/iqtree/)的最简单方法如下：

    # 12s
    time qiime phylogeny iqtree \
      --i-alignment masked-aligned-rep-seqs.qza \
      --o-tree iqt-tree.qza \
      --verbose

显示如下结果：

    Running external command line application. This may print messages to stdout and/or stderr.
    The command being run is below. This command cannot be manually re-run as it will depend on temporary files that no longer exist.
    
    Command: iqtree -st DNA --runs 1 -s /tmp/qiime2-archive-5pz537ii/0f292022-14c0-431e-83ea-87e07fa04b35/data/aligned-dna-sequences.fasta -m MFP -pre /tmp/tmpio8g5og8/q2iqtree -nt 1
    
    IQ-TREE multicore version 1.6.12 for Linux 64-bit built Aug 15 2019
    Developed by Bui Quang Minh, Nguyen Lam Tung, Olga Chernomor,
    Heiko Schmidt, Dominik Schrempf, Michael Woodhams.
    
    Host:    biocloud (AVX2, FMA3, 1007 GB RAM)
    Command: iqtree -st DNA --runs 1 -s /tmp/qiime2-archive-5pz537ii/0f292022-14c0-431e-83ea-87e07fa04b35/data/aligned-dna-sequences.fasta -m MFP -pre /tmp/tmpio8g5og8/q2iqtree -nt 1
    Seed:    294079 (Using SPRNG - Scalable Parallel Random Number Generator)
    Time:    Thu May 14 16:59:37 2020
    Kernel:  AVX+FMA - 1 threads (96 CPU cores detected)
    
    HINT: Use -nt option to specify number of threads because your CPU has 96 cores!
    HINT: -nt AUTO will automatically determine the best number of threads to use.
    
    Reading alignment file /tmp/qiime2-archive-5pz537ii/0f292022-14c0-431e-83ea-87e07fa04b35/data/aligned-dna-sequences.fasta ... Fasta format detected
    Alignment most likely contains DNA/RNA sequences
    Alignment has 20 sequences with 214 columns, 157 distinct patterns
    104 parsimony-informative, 33 singleton sites, 77 constant sites
                                              Gap/Ambiguity  Composition  p-value
       1  e84fcf85a6a4065231dcf343bb862f1cb32abae6   40.65%    passed     90.91%
       2  5525fb6dab7b6577960147574465990c6df070ad   42.99%    passed     99.80%
    ......
      20  ed1acad8a98e8579a44370733533ad7d3fed8006   48.13%    passed     58.15%
    ****  TOTAL                                      39.77%  1 sequences failed composition chi2 test (p-value<5%; df=3)
    
    
    Create initial parsimony tree by phylogenetic likelihood library (PLL)... 0.003 seconds
    NOTE: ModelFinder requires 1 MB RAM!
    ModelFinder will test 286 DNA models (sample size: 214) ...
     No. Model         -LnL         df  AIC          AICc         BIC
      1  JC            1425.567     37  2925.133     2941.111     3049.674
      2  JC+I          1424.229     38  2924.459     2941.396     3052.366
    ......
    279  GTR+F+R3      1387.357     49  2872.715     2902.593     3037.647
    Akaike Information Criterion:           TVMe+R2
    Corrected Akaike Information Criterion: TVMe+R2
    Bayesian Information Criterion:         TVMe+R2
    Best-fit model: TVMe+R2 chosen according to BIC
    
    All model information printed to /tmp/tmpio8g5og8/q2iqtree.model.gz
    CPU time for ModelFinder: 1.280 seconds (0h:0m:1s)
    Wall-clock time for ModelFinder: 1.326 seconds (0h:0m:1s)
    
    NOTE: 0 MB RAM (0 GB) is required!
    Estimate model parameters (epsilon = 0.100)
    1. Initial log-likelihood: -1416.738
    2. Current log-likelihood: -1396.508
    3. Current log-likelihood: -1389.944
    4. Current log-likelihood: -1389.313
    5. Current log-likelihood: -1389.127
    6. Current log-likelihood: -1389.021
    Optimal log-likelihood: -1388.956
    Rate parameters:  A-C: 0.16336  A-G: 2.04987  A-T: 1.55702  C-G: 0.78640  C-T: 2.04987  G-T: 1.00000
    Base frequencies:  A: 0.250  C: 0.250  G: 0.250  T: 0.250
    Site proportion and rates:  (0.668,0.373) (0.332,2.263)
    Parameters optimization took 6 rounds (0.045 sec)
    Computing ML distances based on estimated model parameters... 0.004 sec
    Computing BIONJ tree...
    0.000 seconds
    Log-likelihood of BIONJ tree: -1389.065
    --------------------------------------------------------------------
    |             INITIALIZING CANDIDATE TREE SET                      |
    --------------------------------------------------------------------
    Generating 98 parsimony trees... 0.152 second
    Computing log-likelihood of 98 initial trees ... 0.188 seconds
    Current best score: -1388.956
    
    Do NNI search on 20 best initial trees
    Estimate model parameters (epsilon = 0.100)
    BETTER TREE FOUND at iteration 1: -1382.373
    Iteration 10 / LogL: -1382.379 / Time: 0h:0m:0s
    Iteration 20 / LogL: -1382.373 / Time: 0h:0m:0s
    Finish initializing candidate tree set (1)
    Current best tree score: -1382.373 / CPU time: 0.600
    Number of iterations: 20
    --------------------------------------------------------------------
    |               OPTIMIZING CANDIDATE TREE SET                      |
    --------------------------------------------------------------------
    UPDATE BEST LOG-LIKELIHOOD: -1382.372
    Iteration 30 / LogL: -1386.029 / Time: 0h:0m:0s (0h:0m:2s left)
    Iteration 40 / LogL: -1384.603 / Time: 0h:0m:1s (0h:0m:1s left)
    Iteration 50 / LogL: -1384.608 / Time: 0h:0m:1s (0h:0m:1s left)
    Estimate model parameters (epsilon = 0.100)
    BETTER TREE FOUND at iteration 52: -1382.030
    Iteration 60 / LogL: -1384.345 / Time: 0h:0m:1s (0h:0m:2s left)
    BETTER TREE FOUND at iteration 61: -1382.027
    Iteration 70 / LogL: -1382.100 / Time: 0h:0m:1s (0h:0m:2s left)
    Iteration 80 / LogL: -1382.033 / Time: 0h:0m:1s (0h:0m:1s left)
    Iteration 90 / LogL: -1382.871 / Time: 0h:0m:2s (0h:0m:1s left)
    Iteration 100 / LogL: -1382.875 / Time: 0h:0m:2s (0h:0m:1s left)
    Iteration 110 / LogL: -1382.098 / Time: 0h:0m:2s (0h:0m:1s left)
    Iteration 120 / LogL: -1382.879 / Time: 0h:0m:2s (0h:0m:0s left)
    Iteration 130 / LogL: -1382.498 / Time: 0h:0m:2s (0h:0m:0s left)
    Iteration 140 / LogL: -1382.502 / Time: 0h:0m:2s (0h:0m:0s left)
    Iteration 150 / LogL: -1382.430 / Time: 0h:0m:3s (0h:0m:0s left)
    Iteration 160 / LogL: -1382.118 / Time: 0h:0m:3s (0h:0m:0s left)
    TREE SEARCH COMPLETED AFTER 162 ITERATIONS / Time: 0h:0m:3s
    
    --------------------------------------------------------------------
    |                    FINALIZING TREE SEARCH                        |
    --------------------------------------------------------------------
    Performs final model parameters optimization
    Estimate model parameters (epsilon = 0.010)
    1. Initial log-likelihood: -1382.027
    Optimal log-likelihood: -1382.018
    Rate parameters:  A-C: 0.18868  A-G: 1.82567  A-T: 1.52062  C-G: 0.76578  C-T: 1.82567  G-T: 1.00000
    Base frequencies:  A: 0.250  C: 0.250  G: 0.250  T: 0.250
    Site proportion and rates:  (0.719,0.413) (0.281,2.500)
    Parameters optimization took 1 rounds (0.005 sec)
    BEST SCORE FOUND : -1382.018
    Total tree length: 7.018
    
    Total number of iterations: 162
    CPU time used for tree search: 2.988 sec (0h:0m:2s)
    Wall-clock time used for tree search: 3.278 sec (0h:0m:3s)
    Total CPU time used: 3.052 sec (0h:0m:3s)
    Total wall-clock time used: 3.349 sec (0h:0m:3s)
    
    Analysis results written to: 
      IQ-TREE report:                /tmp/tmpio8g5og8/q2iqtree.iqtree
      Maximum-likelihood tree:       /tmp/tmpio8g5og8/q2iqtree.treefile
      Likelihood distances:          /tmp/tmpio8g5og8/q2iqtree.mldist
      Screen log file:               /tmp/tmpio8g5og8/q2iqtree.log
    
    Date and Time: Thu May 14 16:59:42 2020
    Saved Phylogeny[Unrooted] to: iqt-tree.qza

**输出对象：**
- `iqt-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-tree.qza)

### 指定替代模型Specifying a substitution model

我们还可以设置我们选择的替代模型。您可能在观看上一个命令的屏幕输出时注意到，已注意到ModelFinder选择的最佳拟合模型。为了争辩起见，假设最佳选择的模型显示为`GTR+F+I+G4`。 F仅是一种表示法，它使我们知道，如果给定模型支持不相等的基频，则默认情况下将使用经验基频。使用经验基础频率（F）而不是估计它们，可以大大减少计算时间。 iqtree插件在命令行提供的模型符号内将不接受F，因为对于适当的模型，这始终会自动隐含。另外，iqtree插件仅接受在模型符号中指定的G而不是G4。 4只是另一个明确的表示法，以提醒我们默认情况下采用四个比率类别。在命令行上提供模型符号时，插件使用的符号方法仅有助于保持简单性和熟悉性。因此，简单来说，我们只需要输入`GTR+I+G`作为我们的输入模型：

    # 9s
    time qiime phylogeny iqtree \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-substitution-model 'GTR+I+G' \
      --o-tree iqt-gtrig-tree.qza \
      --verbose

显示结果同上面类似，省略重复部分。 

    Date and Time: Thu May 14 17:04:04 2020
    Saved Phylogeny[Unrooted] to: iqt-gtrig-tree.qza

**输出对象：**
- `iqt-gtrig-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-gtrig-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-gtrig-tree.qza)

让我们重新运行上面的命令并添加`--p-fast`选项。 此选项仅与`iqtree`方法兼容，类似于`fasttree`执行的快速搜索。 🏎️其次，我们还要执行多个树搜索，并保持其中的最好树（就像我们之前使用`raxml --p-n-searches ...`命令所做的那样）：

    # 8s
    time qiime phylogeny iqtree \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-substitution-model 'GTR+I+G' \
      --p-fast \
      --p-n-runs 10 \
      --o-tree iqt-gtrig-fast-ms-tree.qza \
      --verbose

显示结果同上面类似，省略重复部分。 

    Date and Time: Thu May 14 17:15:01 2020
    Saved Phylogeny[Unrooted] to: iqt-gtrig-fast-ms-tree.qza

**输出对象：**
- `iqt-gtrig-fast-ms-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-gtrig-fast-ms-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-gtrig-fast-ms-tree.qza)

### 单枝检验 Single branch tests

IQ-TREE提供一些单枝检验的方法

1. [SH-aLRT](https://doi.org/10.1093/sysbio/syq010)：`--p-alrt [INT >= 1000]`
2. [aBayes](https://doi.org/10.1093/sysbio/syr041): `--p-abayes [TRUE | FALSE]`
3. [local bootstrap test](https://doi.org/10.1007/BF0249864): `--p-lbp [INT >= 1000]`

单分支检验通常被用作我们上面讨论过的自展方法的替代方法，因为它们的速度要快得多，并且在构建大型系统发育树（例如，> 10,000个类群）时经常被推荐使用。 这三种方法均可同时应用，并在iTOL中视为独立的自展支持率。 这些值始终按*alrt / lbp / abayes*的以下顺序列出。 我们将继续并在下一个命令中应用所有分支检验，同时指定与上述相同的替代模型。 随时将其与`--p-fast`选项结合使用。 😉

    # 12s
    time qiime phylogeny iqtree \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-alrt 1000 \
      --p-abayes \
      --p-lbp 1000 \
      --p-substitution-model 'GTR+I+G' \
      --o-tree iqt-sbt-tree.qza \
      --verbose

**输出对象：**
- `iqt-sbt-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-sbt-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-sbt-tree.qza)

> 小贴士：IQ-TREE搜索设置。 `iqtree`有很多可调整的参数，可以对其进行修改，以改善通过“树空间”的搜索，并防止搜索算法陷入局部最优状态。在这方面有帮助的一种最佳实践是调整以下参数：`--p-perturb-nni-strength`和`--p-stop-iter`（每个参数分别映射到`iqtree`的`-pers`和`-nstop`标志）。简而言之，NNI（nearest-neighbor interchange, 最近邻居交换）扰动的值越大，“树空间”中的跳跃就越大。该值应设置得足够高，以允许搜索算法避免陷入局部最优状态，但又不能设置得太高，以免搜索偶然在“树空间”中跳跃。也就是说，像Goldilocks和三个🐻，您需要找到一个“恰好”的设置，或者至少在一个合理的范围内。一种评估方法是使用`--verbose`标志进行一些短期试用。如果您看到似然值跳得很大，则可以降低`--p-perturb-nni-strength`的值。至于停止标准，即`--p-stop-iter`，此值越高，您在“树空间”中的搜索就越彻底。请注意，增加此值也可能会增加运行时间。也就是说，搜索将继续进行，直到采样了许多树（例如100（默认）），而没有找到更好的评分树。如果找到更好的树，则计数器重置，然后继续搜索。当给定的数据集包含许多短序列（对于微生物组调查数据非常普遍）时，这两个参数值得特别考虑。我们可以对原始命令进行修改，以包含这些额外的参数，并建议对短序列进行修改，例如，较低的扰动强度值（较短的读取不包含太多的系统发育信息，因此，我们应限制在“树空间”中跳转的距离”）和更多的停止迭代。有关默认参数设置的更多详细信息，请参见IQ-TREE命令参考。最后，我们将让iqtree执行模型测试，并自动确定要使用的CPU核心的最佳数量。

    # 11s
    time qiime phylogeny iqtree \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-perturb-nni-strength 0.2 \
      --p-stop-iter 200 \
      --p-n-cores 1 \
      --o-tree iqt-nnisi-fast-tree.qza \
      --verbose

**输出对象：**
- `iqt-nnisi-fast-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-nnisi-fast-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-nnisi-fast-tree.qza)


### iqtree-ultrafast-bootstrap

根据我们在上面的`raxml-rapid-bootstrap`部分中的讨论，我们还可以使用IQ-TREE来评估通过[超快速自展算法](https://doi.org/10.1093/molbev/msx281)在系统进化系统中对拆分/划分的支持程度。 下面，我们将应用插件的[ultrafast bootstrap命令](https://docs.qiime2.org/2020.2/plugins/available/phylogeny/iqtree-ultrafast-bootstrap/)：自动模型选择（`MFP`），执行`1000`次迭代自展（最低要求），设置相同的建议参数以从短序列构建系统发育，并自动确定最佳CPU使用数量：

    # 15s
    time qiime phylogeny iqtree-ultrafast-bootstrap \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-perturb-nni-strength 0.2 \
      --p-stop-iter 200 \
      --p-n-cores 1 \
      --o-tree iqt-nnisi-bootstrap-tree.qza \
      --verbose

**输出对象：**
- `iqt-nnisi-bootstrap-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-nnisi-bootstrap-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-nnisi-bootstrap-tree.qza)

### 与ufboot一起执行单分支检验 Perform single branch tests alongside ufboot

我们还可以将单分支检验方法与超快速自展同时应用。 支持值将始终按以下顺序表示：*alrt / lbp / abayes / ufboot*。 同样，这些值可以视为[iTOL](https://itol.embl.de/)中单独列出的自展支持率。 我们还将像之前一样指定一个模型。

    # 16s
    time qiime phylogeny iqtree-ultrafast-bootstrap \
      --i-alignment masked-aligned-rep-seqs.qza \
      --p-perturb-nni-strength 0.2 \
      --p-stop-iter 200 \
      --p-n-cores 1 \
      --p-alrt 1000 \
      --p-abayes \
      --p-lbp 1000 \
      --p-substitution-model 'GTR+I+G' \
      --o-tree iqt-nnisi-bootstrap-sbt-gtrig-tree.qza \
      --verbose

**输出对象：**
- `iqt-nnisi-bootstrap-sbt-gtrig-tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-nnisi-bootstrap-sbt-gtrig-tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-nnisi-bootstrap-sbt-gtrig-tree.qza)

> 小贴士：如果需要减少在[UFBoot搜索](https://doi.org/10.1093/molbev/msx281)过程中发生的[潜在模型违规](http://www.iqtree.org/doc/Tutorial#reducing-impact-of-severe-model-violations-with-ufboot)的影响，并且/或者只是想更加严格，我们可以在任何`iqtree-ultrafast-bootstrap`中添加`--p-bnni`选项。

## 确定树的根 Root the phylogeny

为了正确使用UniFrac等多样性指标，系统发育必须确定根。 通常，在生根树时选择外组。 通常，默认情况下，使用最大似然性的系统发育推断工具通常会返回无根的树。

QIIME 2为[中点根](https://docs.qiime2.org/2020.2/plugins/available/phylogeny/midpoint-root/)为我们的系统发育提供了一种方法。 将来可能会提供其他定根选项。 现在，我们将从`iqtree-ultrafast-bootstrap`确定我们自展树的根，如下所示：

    # 7s
    time qiime phylogeny midpoint-root \
      --i-tree iqt-nnisi-bootstrap-sbt-gtrig-tree.qza \
      --o-rooted-tree iqt-nnisi-bootstrap-sbt-gtrig-tree-rooted.qza

**输出对象：**
- `iqt-nnisi-bootstrap-sbt-gtrig-tree-rooted.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fiqt-nnisi-bootstrap-sbt-gtrig-tree-rooted.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/iqt-nnisi-bootstrap-sbt-gtrig-tree-rooted.qza)

> 小贴士：iTOL查看提醒。 我们可以通过iTOL查看我们的树及其关联的对齐方式。 您需要做的就是上传`iqt-nnisi-bootstrap-sbt-gtrig-tree-rooted.qza`树文件。 在普通模式下显示树。 然后将`masked-aligned-rep-seqs.qza`文件拖放到可视化文件上。 现在，您可以查看比对旁边的系统发育。



# 流程 Pipelines

在这里，我们将概述系统发育流程：[`align-to-tree-mafft-fasttree`](https://docs.qiime2.org/2020.2/plugins/available/phylogeny/align-to-tree-mafft-fasttree/)

流程的一个优点是，它们将常用命令的有序集合组合为一个压缩的简单命令。为了使这些“便利”管道易于使用，通常只向用户公开一些选项。也就是说，通过管道执行的大多数命令通常都配置为使用默认选项设置。但是，提供了对于用户来说考虑设置非常重要的选项。通过给定流程公开的选项在很大程度上取决于它在做什么。流程也是新用户入门的好方法，因为它有助于为建立标准操作程序奠定良好实践的基础。

而不是运行下面列出的一个或多个以下QIIME 2命令：

1. `qiime alignment mafft ...`
2. `qiime alignment mask ...`
3. `qiime phylogeny fasttree ...`
4. `qiime phylogeny midpoint-root ...`

我们可以利用流程`align-tree-mafft-fasttree`一次性完成上述四个步骤。这是从流程帮助文档中获得的描述：

> 该流程将从使用MAFFT创建序列比对开始，此后，系统上无信息或歧义比对的所有比对列都将被删除（屏蔽）。产生的屏蔽对齐将用于推断系统发育树，然后在其中点确定根。流程每个步骤的输出文件将被保存。这包括来自`q2-alignment`方法的未屏蔽和已屏蔽的MAFFT对齐方式，以及来自`q2-phylogeny`方法的有根和无根系统发育。

只需运行以下命令即可完成所有操作：

    # 6s
    time qiime phylogeny align-to-tree-mafft-fasttree \
      --i-sequences rep-seqs.qza \
      --output-dir mafft-fasttree-output

**输出对象：**
- `mafft-fasttree-output/masked_alignment.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fmafft-fasttree-output%2Fmasked_alignment.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/mafft-fasttree-output/masked_alignment.qza)
- `mafft-fasttree-output/rooted_tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fmafft-fasttree-output%2Frooted_tree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/mafft-fasttree-output/rooted_tree.qza)
- `mafft-fasttree-output/alignment.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fmafft-fasttree-output%2Falignment.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/mafft-fasttree-output/alignment.qza)
- `mafft-fasttree-output/tree.qza`：[预览](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fphylogeny%2Fmafft-fasttree-output%2Ftree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/phylogeny/mafft-fasttree-output/tree.qza)

恭喜你！ 您现在知道了如何在QIIME 2中构建系统发育树啦！


## Reference

https://docs.qiime2.org/2020.2

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为微生物组数据分析、分析方法开发与优化和科学传播，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Cell Host & Microbe、Current Opinion in Microbiology*** 等杂志发表论文20余篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1300万+。

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
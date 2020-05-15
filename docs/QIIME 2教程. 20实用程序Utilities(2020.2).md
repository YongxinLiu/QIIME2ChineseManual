[TOC]

# 前情提要

- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)，[Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DhecHNqv4UjYpVEu48oXAw)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/cqzpLOprpClaib1FvH7bjg)，[Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/PHpg0y6_mydtCXYUwZa2Yg)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/tmXAjkl7oW3X4uagLOJu2A)，[mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/3tF6_CfSKBbtLQU4G3NpEQ)
- [7帕金森小鼠教程Parkinson's Mouse](https://mp.weixin.qq.com/s/cN1sfcWFME7S4OJy4VIREg)，[Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/OINhALYIaH-JZICpU68icQ)
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


# QIIME 2中的实用程序

**Utilities in QIIME 2**

https://docs.qiime2.org/2020.2/tutorials/utilities/

以下是QIIME 2中提供的许多非基于插件的实用程序。以下文档试图演示其中的许多功能。 本文档按[接口interface](https://docs.qiime2.org/2020.2/interfaces/)划分，并尝试交叉引用其他接口中可用的类似功能。

## 命令行`q2cli`

大多数有趣的实用程序都可以在`q2cli`的`tools`子命令中找到：

    qiime tools --help

显示如下结果:

    Usage: qiime tools [OPTIONS] COMMAND [ARGS]...
    
      用于QIIME 2文件的工具。Tools for working with QIIME 2 files.
    
    Options:
      --help      显示帮助并退出Show this message and exit.
    
    Commands:
      citations         显示引文Print citations for a QIIME 2 result.
      export            导出数据Export data from a QIIME 2 Artifact or a Visualization
      extract           解压对象Extract a QIIME 2 Artifact or Visualization archive.
      import            导入数据Import data into a new QIIME 2 Artifact.
      inspect-metadata  检查元数据列Inspect columns available in metadata.
      peek              预览Take a peek at a QIIME 2 Artifact or Visualization.
      validate          验证Validate data in a QIIME 2 Artifact.
      view              查看View a QIIME 2 Visualization.

让我们动手处理一些数据，以便我们可以进一步了解此功能！ 首先，我们将查看[PD Mice教程](https://docs.qiime2.org/2020.2/tutorials/pd-mice/)中的分类条形图：

    mkdir -p utilites && cd utilites
    wget -c  "https://data.qiime2.org/2020.2/tutorials/utilities/taxa-barplot.qzv" \
        -O "taxa-barplot.qzv"

### 检索引文 Retrieving Citations

现在我们有了一些结果，让我们更多地了解与创建此可视化相关的引文。 首先，我们可以检查`qiime tools citations`命令的帮助文本：

    qiime tools citations --help

输出：

    Usage: qiime tools citations [OPTIONS] ARTIFACT/VISUALIZATION
    
      Print citations as a BibTex file (.bib) for a QIIME 2 result.
    
    Options:
      --help      Show this message and exit.

**输出可视化**：

- `taxa-barplot.qzv`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Futilities%2Ftaxa-barplot.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/utilities/taxa-barplot.qzv)

现在我们知道如何使用该命令，我们将运行以下命令：

    qiime tools citations taxa-barplot.qzv

输出结果如下：

    @article{framework|qiime2:2019.10.0|0,
     author = {Bolyen, Evan and Rideout, Jai Ram and Dillon, Matthew R. and Bokulich, Nicholas A. and Abnet, Christian C. and Al-Ghalith, Gabriel A. and Alexander, Harriet and Alm, Eric J. and Arumugam, Manimozhiyan and Asnicar, Francesco and Bai, Yang and Bisanz, Jordan E. and Bittinger, Kyle and Brejnrod, Asker and Brislawn, Colin J. and Brown, C. Titus and Callahan, Benjamin J. and Caraballo-Rodríguez, Andrés Mauricio and Chase, John and Cope, Emily K. and Da Silva, Ricardo and Diener, Christian and Dorrestein, Pieter C. and Douglas, Gavin M. and Durall, Daniel M. and Duvallet, Claire and Edwardson, Christian F. and Ernst, Madeleine and Estaki, Mehrbod and Fouquier, Jennifer and Gauglitz, Julia M. and Gibbons, Sean M. and Gibson, Deanna L. and Gonzalez, Antonio and Gorlick, Kestrel and Guo, Jiarong and Hillmann, Benjamin and Holmes, Susan and Holste, Hannes and Huttenhower, Curtis and Huttley, Gavin A. and Janssen, Stefan and Jarmusch, Alan K. and Jiang, Lingjing and Kaehler, Benjamin D. and Kang, Kyo Bin and Keefe, Christopher R. and Keim, Paul and Kelley, Scott T. and Knights, Dan and Koester, Irina and Kosciolek, Tomasz and Kreps, Jorden and Langille, Morgan G. I. and Lee, Joslynn and Ley, Ruth and Liu, Yong-Xin and Loftfield, Erikka and Lozupone, Catherine and Maher, Massoud and Marotz, Clarisse and Martin, Bryan D. and McDonald, Daniel and McIver, Lauren J. and Melnik, Alexey V. and Metcalf, Jessica L. and Morgan, Sydney C. and Morton, Jamie T. and Naimey, Ahmad Turan and Navas-Molina, Jose A. and Nothias, Louis Felix and Orchanian, Stephanie B. and Pearson, Talima and Peoples, Samuel L. and Petras, Daniel and Preuss, Mary Lai and Pruesse, Elmar and Rasmussen, Lasse Buur and Rivers, Adam and Robeson, Michael S. and Rosenthal, Patrick and Segata, Nicola and Shaffer, Michael and Shiffer, Arron and Sinha, Rashmi and Song, Se Jin and Spear, John R. and Swafford, Austin D. and Thompson, Luke R. and Torres, Pedro J. and Trinh, Pauline and Tripathi, Anupriya and Turnbaugh, Peter J. and Ul-Hasan, Sabah and van der Hooft, Justin J. J. and Vargas, Fernando and Vázquez-Baeza, Yoshiki and Vogtmann, Emily and von Hippel, Max and Walters, William and Wan, Yunhu and Wang, Mingxun and Warren, Jonathan and Weber, Kyle C. and Williamson, Charles H. D. and Willis, Amy D. and Xu, Zhenjiang Zech and Zaneveld, Jesse R. and Zhang, Yilong and Zhu, Qiyun and Knight, Rob and Caporaso, J. Gregory},
     doi = {10.1038/s41587-019-0209-9},
     issn = {1546-1696},
     journal = {Nature Biotechnology},
     number = {8},
     pages = {852-857},
     title = {Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2},
     url = {https://doi.org/10.1038/s41587-019-0209-9},
     volume = {37},
     year = {2019}
    }
    
    @article{view|types:2019.10.0|BIOMV210DirFmt|0,
     author = {McDonald, Daniel and Clemente, Jose C and Kuczynski, Justin and Rideout, Jai Ram and Stombaugh, Jesse and Wendel, Doug and Wilke, Andreas and Huse, Susan and Hufnagle, John and Meyer, Folker and Knight, Rob and Caporaso, J Gregory},
     doi = {10.1186/2047-217X-1-7},
     journal = {GigaScience},
     number = {1},
     pages = {7},
     publisher = {BioMed Central},
     title = {The Biological Observation Matrix (BIOM) format or: how I learned to stop worrying and love the ome-ome},
     volume = {1},
     year = {2012}
    }
    
    @inproceedings{view|types:2019.10.0|pandas.core.frame:DataFrame|0,
     author = { Wes McKinney },
     booktitle = { Proceedings of the 9th Python in Science Conference },
     editor = { Stéfan van der Walt and Jarrod Millman },
     pages = { 51 -- 56 },
     title = { Data Structures for Statistical Computing in Python },
     year = { 2010 }
    }
    
    @inproceedings{view|types:2019.10.0|pandas.core.series:Series|0,
     author = { Wes McKinney },
     booktitle = { Proceedings of the 9th Python in Science Conference },
     editor = { Stéfan van der Walt and Jarrod Millman },
     pages = { 51 -- 56 },
     title = { Data Structures for Statistical Computing in Python },
     year = { 2010 }
    }
    
    @article{view|types:2019.10.0|biom.table:Table|0,
     author = {McDonald, Daniel and Clemente, Jose C and Kuczynski, Justin and Rideout, Jai Ram and Stombaugh, Jesse and Wendel, Doug and Wilke, Andreas and Huse, Susan and Hufnagle, John and Meyer, Folker and Knight, Rob and Caporaso, J Gregory},
     doi = {10.1186/2047-217X-1-7},
     journal = {GigaScience},
     number = {1},
     pages = {7},
     publisher = {BioMed Central},
     title = {The Biological Observation Matrix (BIOM) format or: how I learned to stop worrying and love the ome-ome},
     volume = {1},
     year = {2012}
    }
    
    @article{framework|qiime2:2019.4.0|0,
     author = {Bolyen, Evan and Rideout, Jai Ram and Dillon, Matthew R and Bokulich, Nicholas A and Abnet, Christian and Al-Ghalith, Gabriel A and Alexander, Harriet and Alm, Eric J and Arumugam, Manimozhiyan and Asnicar, Francesco and Bai, Yang and Bisanz, Jordan E and Bittinger, Kyle and Brejnrod, Asker and Brislawn, Colin J and Brown, C Titus and Callahan, Benjamin J and Caraballo-Rodríguez, Andrés Mauricio and Chase, John and Cope, Emily and Da Silva, Ricardo and Dorrestein, Pieter C and Douglas, Gavin M and Durall, Daniel M and Duvallet, Claire and Edwardson, Christian F and Ernst, Madeleine and Estaki, Mehrbod and Fouquier, Jennifer and Gauglitz, Julia M and Gibson, Deanna L and Gonzalez, Antonio and Gorlick, Kestrel and Guo, Jiarong and Hillmann, Benjamin and Holmes, Susan and Holste, Hannes and Huttenhower, Curtis and Huttley, Gavin and Janssen, Stefan and Jarmusch, Alan K and Jiang, Lingjing and Kaehler, Benjamin and Kang, Kyo Bin and Keefe, Christopher R and Keim, Paul and Kelley, Scott T and Knights, Dan and Koester, Irina and Kosciolek, Tomasz and Kreps, Jorden and Langille, Morgan GI and Lee, Joslynn and Ley, Ruth and Liu, Yong-Xin and Loftfield, Erikka and Lozupone, Catherine and Maher, Massoud and Marotz, Clarisse and Martin, Bryan and McDonald, Daniel and McIver, Lauren J and Melnik, Alexey V and Metcalf, Jessica L and Morgan, Sydney C and Morton, Jamie and Naimey, Ahmad Turan and Navas-Molina, Jose A and Nothias, Louis Felix and Orchanian, Stephanie B and Pearson, Talima and Peoples, Samuel L and Petras, Daniel and Preuss, Mary Lai and Pruesse, Elmar and Rasmussen, Lasse Buur and Rivers, Adam and Robeson, II, Michael S and Rosenthal, Patrick and Segata, Nicola and Shaffer, Michael and Shiffer, Arron and Sinha, Rashmi and Song, Se Jin and Spear, John R and Swafford, Austin D and Thompson, Luke R and Torres, Pedro J and Trinh, Pauline and Tripathi, Anupriya and Turnbaugh, Peter J and Ul-Hasan, Sabah and van der Hooft, Justin JJ and Vargas, Fernando and Vázquez-Baeza, Yoshiki and Vogtmann, Emily and von Hippel, Max and Walters, William and Wan, Yunhu and Wang, Mingxun and Warren, Jonathan and Weber, Kyle C and Williamson, Chase HD and Willis, Amy D and Xu, Zhenjiang Zech and Zaneveld, Jesse R and Zhang, Yilong and Knight, Rob and Caporaso, J Gregory},
     doi = {10.7287/peerj.preprints.27295v1},
     issn = {2167-9843},
     journal = {PeerJ Preprints},
     month = {oct},
     pages = {e27295v1},
     title = {QIIME 2: Reproducible, interactive, scalable, and extensible microbiome data science},
     url = {https://doi.org/10.7287/peerj.preprints.27295v1},
     volume = {6},
     year = {2018}
    }
    
    @article{action|feature-classifier:2019.4.0|method:fit_classifier_naive_bayes|0,
     author = {Pedregosa, Fabian and Varoquaux, Gaël and Gramfort, Alexandre and Michel, Vincent and Thirion, Bertrand and Grisel, Olivier and Blondel, Mathieu and Prettenhofer, Peter and Weiss, Ron and Dubourg, Vincent and Vanderplas, Jake and Passos, Alexandre and Cournapeau, David and Brucher, Matthieu and Perrot, Matthieu and Duchesnay, Édouard},
     journal = {Journal of machine learning research},
     number = {Oct},
     pages = {2825--2830},
     title = {Scikit-learn: Machine learning in Python},
     volume = {12},
     year = {2011}
    }
    
    @inproceedings{view|types:2019.4.1|pandas.core.series:Series|0,
     author = { Wes McKinney },
     booktitle = { Proceedings of the 9th Python in Science Conference },
     editor = { Stéfan van der Walt and Jarrod Millman },
     pages = { 51 -- 56 },
     title = { Data Structures for Statistical Computing in Python },
     year = { 2010 }
    }
    
    @article{plugin|feature-classifier:2019.4.0|0,
     author = {Bokulich, Nicholas A. and Kaehler, Benjamin D. and Rideout, Jai Ram and Dillon, Matthew and Bolyen, Evan and Knight, Rob and Huttley, Gavin A. and Caporaso, J. Gregory},
     doi = {10.1186/s40168-018-0470-z},
     journal = {Microbiome},
     number = {1},
     pages = {90},
     title = {Optimizing taxonomic classification of marker-gene amplicon sequences with QIIME 2's q2-feature-classifier plugin},
     url = {https://doi.org/10.1186/s40168-018-0470-z},
     volume = {6},
     year = {2018}
    }
    
    @article{plugin|dada2:2019.10.0|0,
     author = {Callahan, Benjamin J and McMurdie, Paul J and Rosen, Michael J and Han, Andrew W and Johnson, Amy Jo A and Holmes, Susan P},
     doi = {10.1038/nmeth.3869},
     journal = {Nature methods},
     number = {7},
     pages = {581},
     publisher = {Nature Publishing Group},
     title = {DADA2: high-resolution sample inference from Illumina amplicon data},
     volume = {13},
     year = {2016}
    }
    
    @article{action|feature-classifier:2019.10.0|method:classify_sklearn|0,
     author = {Pedregosa, Fabian and Varoquaux, Gaël and Gramfort, Alexandre and Michel, Vincent and Thirion, Bertrand and Grisel, Olivier and Blondel, Mathieu and Prettenhofer, Peter and Weiss, Ron and Dubourg, Vincent and Vanderplas, Jake and Passos, Alexandre and Cournapeau, David and Brucher, Matthieu and Perrot, Matthieu and Duchesnay, Édouard},
     journal = {Journal of machine learning research},
     number = {Oct},
     pages = {2825--2830},
     title = {Scikit-learn: Machine learning in Python},
     volume = {12},
     year = {2011}
    }
    
    @article{plugin|feature-classifier:2019.10.0|0,
     author = {Bokulich, Nicholas A. and Kaehler, Benjamin D. and Rideout, Jai Ram and Dillon, Matthew and Bolyen, Evan and Knight, Rob and Huttley, Gavin A. and Caporaso, J. Gregory},
     doi = {10.1186/s40168-018-0470-z},
     journal = {Microbiome},
     number = {1},
     pages = {90},
     title = {Optimizing taxonomic classification of marker-gene amplicon sequences with QIIME 2's q2-feature-classifier plugin},
     url = {https://doi.org/10.1186/s40168-018-0470-z},
     volume = {6},
     year = {2018}
    }

如您所见，上面以[BibTeX格式](http://www.bibtex.org/)显示了此特定可视化的引文。

我们还可以看到[特定插件的引用](https://docs.qiime2.org/2020.2/citation/#plugin-specific-citations)：

    qiime vsearch --citations

显示如下：

    % use `qiime tools citations` on a QIIME 2 result for complete list
    
    @article{key0,
     author = {Rognes, Torbjørn and Flouri, Tomáš and Nichols, Ben and Quince, Christopher and Mahé, Frédéric},
     doi = {10.7717/peerj.2584},
     journal = {PeerJ},
     pages = {e2584},
     publisher = {PeerJ Inc.},
     title = {VSEARCH: a versatile open source tool for metagenomics},
     volume = {4},
     year = {2016}
    }

以及针对插件的特定操作：

    qiime vsearch cluster-features-open-reference --citations

显示如下：

    % use `qiime tools citations` on a QIIME 2 result for complete list
    
    @article{key0,
     author = {Rideout, Jai Ram and He, Yan and Navas-Molina, Jose A. and Walters, William A. and Ursell, Luke K. and Gibbons, Sean M. and Chase, John and McDonald, Daniel and Gonzalez, Antonio and Robbins-Pianka, Adam and Clemente, Jose C. and Gilbert, Jack A. and Huse, Susan M. and Zhou, Hong-Wei and Knight, Rob and Caporaso, J. Gregory},
     doi = {10.7717/peerj.545},
     journal = {PeerJ},
     pages = {e545},
     publisher = {PeerJ Inc.},
     title = {Subsampled open-reference clustering creates consistent, comprehensive OTU definitions and scales to billions of sequences},
     volume = {2},
     year = {2014}
    }

### 查看可视化 Viewing Visualizations

如果我们要查看分类单元图怎么办？ 一种选择是在https://view.qiime2.org上加载可视化文件。 另一种选择是使用qiime工具视图来完成工作

注意：只能在https://view.qiime2.org上查看出处。

    qiime tools view taxa-barplot.qzv

此步需要图形界面支持。如Linux/Mac系统的桌面下运行。Widnows可使用Linux的远程桌面，详见（[Windows10远程桌面Ubuntu](https://mp.weixin.qq.com/s/Ybr6RVotMi5VvsQHYB9R-g)），或Termial配置支持X11转发(如XShell+Xmanager，或Putty+xming，不推荐，反应极慢)。

这将打开一个浏览器窗口，其中包含您的可视化文件。 完成后，您可以关闭浏览器窗口并按键盘上的ctrl-c终止命令。

### 偷看结果 Peeking at Results

通常，我们需要验证对象的类型和uuid。 我们可以使用`qiime tools peek`命令来查看这些对象的简短摘要报告。 首先，让我们看一些数据：

请选择最适合您的环境的下载选项：

    wget \
      -O "faith-pd-vector.qza" \
      "https://data.qiime2.org/2020.2/tutorials/utilities/faith-pd-vector.qza"

现在我们有了数据，我们可以了解有关该文件的更多信息：

    qiime tools peek faith-pd-vector.qza

显示结果如下：

    UUID:        d5186dce-438d-44bb-903c-cb51a7ad4abe
    Type:        SampleData[AlphaDiversity] % Properties('phylogenetic')
    Data format: AlphaDiversityDirectoryFormat

**输出对象**：

- `faith-pd-vector.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Futilities%2Ffaith-pd-vector.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/utilities/faith-pd-vector.qza)

在这里，我们可以看到对象的类型为`SampleData [AlphaDiversity]％Properties（'phylogenetic'）`，以及对象的UUID和格式。

### 验证结果 Validating Results

我们还可以通过运行`qiime tools validate`来验证文件的完整性

    qiime tools validate faith-pd-vector.qza

显示如下结果

    Result faith-pd-vector.qza appears to be valid at level=max.

如果文件有问题，此命令通常会在在合理范围内很好地报告问题所在。

### 检查元数据 Inspecting Metadata

在[元数据教程中](https://docs.qiime2.org/2020.2/tutorials/metadata/)，我们了解了`metadata tabulate`命令及其创建的可视化效果。 通常，我们不太关心元数据的值，而只是关心它的结构：多少列？ 他们的名字是什么？ 他们是什么类型？ 文件中有多少行（或ID）？

我们可以通过首先下载一些示例元数据来演示这一点：

    wget -c "https://data.qiime2.org/2020.2/tutorials/pd-mice/sample_metadata.tsv" \
      -O "sample-metadata.tsv"

然后运行`qiime tools inspect-metadata`命令：

    qiime tools inspect-metadata sample-metadata.tsv

显示如下结果：

                 COLUMN NAME  TYPE       
    ========================  ===========
                     barcode  categorical
                    mouse_id  categorical
                    genotype  categorical
                     cage_id  categorical
                       donor  categorical
                donor_status  categorical
        days_post_transplant  numeric    
    enotype_and_donor_status  categorical
    ========================  ===========
                        IDS:  48
                    COLUMNS:  8


> 问题：sample-metadata.tsv中有多少个元数据列？ 多少个ID？ 确定存在多少分类列。 

该工具对于了解可作为元数据查看的文件的元数据列名称很有帮助。

> 详者注：我们知道行列数量(48行/IDS代表48个样品，8列/COLUMNS代表有8种样本属性)，以及他们分别是属于分类型catagorical或是数值型numeric。

    wget -c "https://data.qiime2.org/2020.2/tutorials/utilities/jaccard-pcoa.qza" \
      -O "jaccard-pcoa.qza"
  
我们刚刚下载的文件是Jaccard PCoA（来自[PD Mice教程](https://docs.qiime2.org/2020.2/tutorials/pd-mice/)），可以代替“典型” TSV格式的元数据文件使用。 我们可能需要了解我们希望运行的命令的列名，使用inspect-metadata，我们可以了解所有信息：
  
    qiime tools inspect-metadata jaccard-pcoa.qza

结果如下：

    COLUMN NAME  TYPE   
    ===========  =======
         Axis 1  numeric
         Axis 2  numeric
         Axis .  numeric
        Axis 47  numeric
    ===========  =======
           IDS:  47
       COLUMNS:  47

**输出对象**：

- `jaccard-pcoa.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Futilities%2Fjaccard-pcoa.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/utilities/jaccard-pcoa.qza)

> 问题：有多少个ID？ 多少列？ 是否有分类型的列？ 为什么？

> 详者注：共有47个IDS，47列，无分类型列。因为PCoA的结果为坐标值，为数值型。

### 对象接口 Artifact API

即将推出，请继续关注！

## Reference

https://docs.qiime2.org/2020.2

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为微生物组数据分析、分析方法开发与优化和科学传播，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Cell Host & Microbe、Current Opinion in Microbiology*** 等杂志发表论文20余篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1300万+。

## 猜你喜欢

- 10000+: [菌群分析](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg) [宝宝与猫狗](http://mp.weixin.qq.com/s/K3y3an-EaX8iaytmxdzHqA) [提DNA发Nature](http://mp.weixin.qq.com/s/lO5uiMjixJ6aYTjPX-IyaQ) [实验分析谁对结果影响大](http://mp.weixin.qq.com/s/cL_IAoPFfmelKMPMgltrfA)  [Cell微生物专刊](https://mp.weixin.qq.com/s/fN0gpD3bZJDXSp8x4ck-3Q) [肠道指挥大脑](https://mp.weixin.qq.com/s/pZO20VGl3Tf_OtFIbZ-zWw)
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